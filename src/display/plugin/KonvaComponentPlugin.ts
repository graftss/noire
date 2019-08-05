import Konva from 'konva';
import * as T from '../../types';
import { updateKonvaModel } from '../editor';
import { DisplayPlugin } from './DisplayPlugin';
import { Display } from '..';

type TransformerState =
  | { kind: 'component'; target: Konva.Group; transformer: Konva.Transformer }
  | {
      kind: 'model';
      componentId: string;
      target: Konva.Shape;
      transformer: Konva.Transformer;
    };

interface DragEndEvent {
  target: { attrs: Vec2 };
}

interface TransformEndEvent {
  target: { attrs: { scaleX: number; scaleY: number } };
}

const attachTransformer = (
  model: Konva.Group,
  layer: Konva.Layer,
): Konva.Transformer => {
  const transformer = new Konva.Transformer({
    anchorSize: 7,
    borderDash: [4, 4],
    borderStroke: 'red',
    borderStrokeWidth: 2,
    rotateEnabled: false,
  });

  transformer.attachTo(model);
  layer.add(transformer);
  return transformer;
};

export class KonvaComponentPlugin extends DisplayPlugin {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private border: Konva.Rect;
  private transformerState: Maybe<TransformerState>;
  private groupsById: Dict<Konva.Group> = {};
  private componentsById: Dict<T.Component> = {};

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
    eventBus.on({
      kind: 'updateComponentState',
      cb: this.onUpdateComponentState,
    });
    eventBus.on({
      kind: 'requestUpdateComponentModel',
      cb: this.onRequestUpdateComponentModel,
    });
  }

  private onStageClick = ({ target }: { target: Konva.Node }) => {
    if (target === this.border) {
      this.destroyTransformer();
      this.display.eventBus.emit({ kind: 'stageClick', data: this.stage });
    }
  };

  // we need to add each model to its group before calling `init`
  // on the component, which assumes that each model in the
  // component has a parent.
  // in general, the order of the calls made here is very brittle
  // and should be changed carefully.
  private onAddComponent = (component: T.Component): void => {
    const { eventBus } = this.display;
    const { id } = component;
    const offset = component.state.offset;

    this.componentsById[id] = component;

    const group = new Konva.Group({ x: offset.x, y: offset.y });
    this.groupsById[id] = group;
    this.layer.add(group);

    component.modelList().forEach((model: Konva.Shape) => {
      group.add(model);
      model.on('click', () =>
        eventBus.emit({ kind: 'selectComponent', data: id }),
      );
    });

    component.init();

    group.on('dragend', (event: DragEndEvent) => {
      const { x, y } = event.target.attrs;
      const update: T.ComponentState = { offset: { x, y } };
      this.display.emitUpdateComponentState(id, update);
    });

    group.on('transformend', (event: TransformEndEvent) => {
      const { scaleX: x, scaleY: y } = event.target.attrs;
      const update: T.ComponentState = { scale: { x, y } };
      this.display.emitUpdateComponentState(id, update);
    });
  };

  private destroyTransformer = (): void => {
    if (!this.transformerState) return;
    const { transformer, target } = this.transformerState;

    target.draggable(false);
    transformer.destroy();
    this.transformerState = undefined;
  };

  private onSelectComponent = (id: Maybe<string>): void => {
    if (!id) return;

    const ts = this.transformerState;
    const newTarget: Maybe<Konva.Group> = this.groupsById[id];
    if (ts && newTarget !== ts.target) this.destroyTransformer();
    if (!newTarget) return;

    newTarget.draggable(true);
    this.transformerState = {
      kind: 'component',
      target: newTarget,
      transformer: attachTransformer(newTarget, this.layer),
    };
  };

  onUpdateComponentState = (data: [string, T.ComponentState]) => {
    const [componentId, update] = data;

    if (this.componentsById[componentId]) {
      const group: Konva.Group = this.groupsById[componentId];

      if (update.offset !== undefined) {
        group.setPosition({ x: update.offset.x, y: update.offset.y });
      }

      if (update.scale !== undefined) {
        group.scale({ x: update.scale.x, y: update.scale.y });
      }
    }
  };

  onRequestUpdateComponentModel = (data: [string, string, string, any]) => {
    const [componentId, modelName, modelKey, value] = data;
    const component: Maybe<T.Component> = this.componentsById[componentId];
    if (!component) return;

    const model: Maybe<Konva.Shape> = component.graphics.models[modelName];
    if (model === undefined) return;

    const newModel = updateKonvaModel(model, modelKey, value);
    this.display.eventBus.emit({
      kind: 'updateComponentModel',
      data: [componentId, modelKey, newModel],
    });
  };
}
