import Konva from 'konva';
import * as T from '../../../types';
import { DisplayPlugin } from './DisplayPlugin';
import { Display } from '..';

interface SelectedComponentState {
  componentId: string;
  transformer: Konva.Transformer;
}

interface DragEndEvent {
  target: { attrs: Vec2 };
}

const attachTransformer = (
  shape: Konva.Group,
  layer: Konva.Layer,
): Konva.Transformer => {
  const transformer = new Konva.Transformer({
    anchorSize: 6,
    borderDash: [4, 4],
    borderStroke: 'red',
    borderStrokeWidth: 2,
    rotateEnabled: false,
  });

  transformer.attachTo(shape);
  layer.add(transformer);
  return transformer;
};

export class KonvaComponentPlugin extends DisplayPlugin {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private border: Konva.Rect;
  private selected: Maybe<SelectedComponentState>;
  private groupsById: Dict<Konva.Group> = {};

  constructor(config: T.NoireConfig, display: Display) {
    super(config, display);
    const { eventBus } = display;
    const { canvasTarget, width, height } = config;

    this.stage = new Konva.Stage({
      width,
      height,
      container: canvasTarget,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.border = new Konva.Rect({
      x: 0,
      y: 0,
      width,
      height,
      fill: 'rgba(0,0,0,0)',
      stroke: 'black',
      strokeWidth: 2,
    });

    this.layer.add(this.border);

    this.stage.on('click', this.onStageClick);
    eventBus.on({ kind: 'addComponent', cb: this.onAddComponent });
    eventBus.on({ kind: 'requestDraw', cb: () => this.layer.draw() });
    eventBus.on({ kind: 'selectComponent', cb: this.onSelectComponent });
  }

  private onStageClick = ({ target }: { target: Konva.Node }) => {
    if (target === this.border) {
      this.deselectComponent();
      this.display.eventBus.emit({ kind: 'stageClick', data: this.stage });
    }
  };

  // we need to add each shape to its group before calling `init`
  // on the component, which assumes that each shape in the
  // component has a parent.
  // in general, the order of the calls made here is very brittle
  // and should be changed carefully.
  private onAddComponent = (component: T.Component): void => {
    const { eventBus } = this.display;
    const offset = component.state.offset;

    const group = new Konva.Group({
      x: offset.x,
      y: offset.y,
    });

    group.on('dragend', (event: DragEndEvent) => {
      const { x, y } = event.target.attrs;
      const state: T.ComponentState = { offset: { x, y } };
      this.display.emitUpdateComponentState(component.id, state);
    });

    this.groupsById[component.id] = group;

    component.shapeList().forEach(shape => {
      group.add(shape);
      shape.on('click', () =>
        eventBus.emit({ kind: 'selectComponent', data: component.id }),
      );
    });

    this.layer.add(group);
    component.init();
  };

  private deselectComponent = (): void => {
    if (!this.selected) return;
    const { componentId, transformer } = this.selected;

    this.groupsById[componentId].draggable(false);
    transformer.destroy();
    this.selected = undefined;
  };

  private onSelectComponent = (id: Maybe<string>): void => {
    if (!id) return;

    if (this.selected && id !== this.selected.componentId) {
      this.deselectComponent();
    }

    if (!this.selected) {
      const group: Maybe<Konva.Group> = this.groupsById[id];
      group.draggable(true);
      this.selected = group && {
        componentId: id,
        transformer: attachTransformer(group, this.layer),
      };
    }
  };
}
