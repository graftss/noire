import Konva from 'konva';
import * as T from '../../../types';
import { DisplayEventBus } from '../DisplayEventBus';
import { unMaybeList, values } from '../../../utils';
import { DisplayPlugin } from './DisplayPlugin';

interface SelectedComponentState {
  componentId: string;
  transformers: Konva.Transformer[];
}

const attachTransformer = (
  shape: Konva.Shape,
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

  constructor(config: T.NoireConfig, eb: DisplayEventBus) {
    super(config, eb);
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
    this.eb.on({ kind: 'componentAdd', cb: this.onComponentAdd });
    this.eb.on({ kind: 'requestDraw', cb: () => this.layer.draw() });
  }

  private onStageClick = ({ target }: { target: Konva.Node }) => {
    if (target === this.border) {
      this.deselectComponent();

      this.eb.emit({
        kind: 'stageClick',
        data: [this.stage],
      });
    }
  };

  private onComponentAdd = (component: T.Component): void => {
    const group = new Konva.Group();
    const shapes = unMaybeList(values(component.graphics.shapes));

    shapes.forEach(shape => {
      group.add(shape);
      shape.on('click', () => this.onShapeClick(component, shapes));
    });

    this.layer.add(group);
    component.init();
  };

  private deselectComponent = (): void => {
    if (!this.selected) return;
    this.selected.transformers.forEach(t => t.destroy());
    this.selected = undefined;
  };

  private onShapeClick = (
    component: T.Component,
    shapes: Konva.Shape[],
  ): void => {
    const componentId = component.id;

    if (this.selected && componentId !== this.selected.componentId) {
      this.deselectComponent();
    }

    if (!this.selected) {
      const transformers = shapes.map(s => attachTransformer(s, this.layer));
      this.selected = { componentId, transformers };
    }

    this.eb.emit({ kind: 'componentSelect', data: [component] });
  };
}
