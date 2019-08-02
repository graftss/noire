import Konva from 'konva';
import * as T from '../../../types';
import { DisplayEventBus } from '../DisplayEventBus';
import { ComponentManager } from '../ComponentManager';
import { DisplayPlugin } from './DisplayPlugin';

interface SelectedComponentState {
  componentId: string;
  transformer: Konva.Transformer;
}

const attachTransformer = (
  shape: Konva.Group,
  layer: Konva.Layer,
): Konva.Transformer => {
  const transformer = new Konva.Transformer({
    anchorSize: 0,
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

  constructor(
    config: T.NoireConfig,
    eventBus: DisplayEventBus,
    cm: ComponentManager,
  ) {
    super(config, eventBus, cm);
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
    this.eventBus.on({ kind: 'addComponent', cb: this.onAddComponent });
    this.eventBus.on({ kind: 'requestDraw', cb: () => this.layer.draw() });
    this.eventBus.on({ kind: 'selectComponent', cb: this.onSelectComponent });
  }

  private onStageClick = ({ target }: { target: Konva.Node }) => {
    if (target === this.border) {
      this.deselectComponent();
      this.eventBus.emit({ kind: 'stageClick', data: this.stage });
    }
  };

  private onAddComponent = (component: T.Component): void => {
    // we need to add each shape to its group before calling `init`
    // on the component, which assumes that each shape in the
    // component has a parent.
    // in general, the order of the calls made here is very brittle
    // and should be changed carefully.
    const offset = component.state.offset;
    const group = new Konva.Group({ x: offset.x, y: offset.y });
    this.groupsById[component.id] = group;

    component.shapeList().forEach(shape => {
      group.add(shape);
      shape.on('click', () =>
        this.eventBus.emit({ kind: 'selectComponent', data: component.id }),
      );
    });

    this.eventBus.on({
      kind: 'updateComponentState',
      cb: ([id, state]: [string, T.ComponentState]) => {
        if (state.offset) this.groupsById[id].setPosition(state.offset);
      },
    });

    this.layer.add(group);
    component.init();
  };

  private deselectComponent = (): void => {
    if (!this.selected) return;
    this.selected.transformer.destroy();
    this.selected = undefined;
  };

  private onSelectComponent = (id: Maybe<string>): void => {
    if (!id) return;

    if (this.selected && id !== this.selected.componentId) {
      this.deselectComponent();
    }

    if (!this.selected) {
      const group: Maybe<Konva.Group> = this.groupsById[id];
      this.selected = group && {
        componentId: id,
        transformer: attachTransformer(group, this.layer),
      };
    }
  };
}
