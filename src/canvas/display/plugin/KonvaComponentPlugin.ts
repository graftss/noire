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
    this.eventBus.on({ kind: 'componentAdd', cb: this.onComponentAdd });
    this.eventBus.on({ kind: 'requestDraw', cb: () => this.layer.draw() });
    this.eventBus.on({ kind: 'componentSelect', cb: this.onComponentSelect });
  }

  private onStageClick = ({ target }: { target: Konva.Node }) => {
    if (target === this.border) {
      this.deselectComponent();

      this.eventBus.emit({
        kind: 'stageClick',
        data: [this.stage],
      });
    }
  };

  private onComponentAdd = (component: T.Component): void => {
    const group = new Konva.Group();
    this.groupsById[component.id] = group;
    this.layer.add(group);

    component.init();
    component.shapeList().forEach(shape => {
      group.add(shape);
      shape.on('click', () =>
        this.eventBus.emit({ kind: 'componentSelect', data: [component.id] }),
      );
    });
  };

  private deselectComponent = (): void => {
    if (!this.selected) return;
    this.selected.transformer.destroy();
    this.selected = undefined;
  };

  private onComponentSelect = (id: Maybe<string>): void => {
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
