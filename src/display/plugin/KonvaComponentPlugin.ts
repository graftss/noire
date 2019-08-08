import Konva from 'konva';
import * as T from '../../types';
import { updateKonvaModel } from '../model/konva';
import { defaultTexture } from '../texture';
import { DisplayPlugin } from './DisplayPlugin';
import { Display } from '..';

export type KonvaSelectable =
  | { kind: 'component'; id: string }
  | { kind: 'model'; id: string; modelName: string }
  | { kind: 'filter'; id: string; modelName: string; filterIndex: number };

interface TransformerState {
  transformer: Konva.Transformer;
  node: Konva.Node;
}

interface DragEndEvent {
  target: { attrs: Vec2 };
}

interface TransformEndEvent {
  target: { attrs: { scaleX: number; scaleY: number } };
}

// TODO: possibly allow transformer config
const attachTransformer = (
  model: Konva.Node,
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
      kind: 'selectModel',
      cb: this.onSelectModel,
    });
    eventBus.on({
      kind: 'updateComponentState',
      cb: this.onUpdateComponentState,
    });
    eventBus.on({
      kind: 'requestUpdateComponentModel',
      cb: this.onRequestUpdateComponentModel,
    });
    eventBus.on({
      kind: 'requestUpdateComponentTexture',
      cb: this.onRequestUpdateComponentTexture,
    });
    eventBus.on({
      kind: 'requestDefaultComponentTexture',
      cb: this.onRequestDefaultComponentTexture,
    });
    eventBus.on({
      kind: 'setKonvaTransformerVisibility',
      cb: this.onSetTransformerVisibility,
    });
  }

  private onStageClick = ({ target }: { target: Konva.Node }) => {
    if (target === this.border) {
      this.destroyTransformer();
      this.display.eventBus.emit({ kind: 'stageClick', data: this.stage });
    }
  };

  private selectionToNode(selection: KonvaSelectable): Maybe<Konva.Node> {
    switch (selection.kind) {
      case 'component':
        return this.groupsById[selection.id];
      case 'model': {
        const { id, modelName } = selection;
        return this.componentsById[id].graphics.models[modelName];
      }
    }
  }

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

  private findComponentId(
    id: Maybe<string>,
  ): Maybe<
    | { component: T.Component; group: Konva.Group }
    | { component: undefined; group: undefined }
  > {
    return id === undefined
      ? undefined
      : { component: this.componentsById[id], group: this.groupsById[id] };
  }

  private destroyTransformer = (): void => {
    if (!this.transformerState) return;
    const { transformer, node } = this.transformerState;

    node.draggable(false);
    transformer.destroy();
    this.transformerState = undefined;
    this.layer.draw();
  };

  // since both Konva and this app use event handlers to do a lot of
  // things, it appears as though we need to put the transformer update
  // at the back of the event queue for it to realise anything has
  // changed
  private updateTransformer = (): void => {
    setTimeout(() => {
      if (!this.transformerState) return;
      this.transformerState.transformer.forceUpdate();
    }, 0);
  };

  private initTransformer = (node: Konva.Node): void => {
    node.draggable(true);
    this.destroyTransformer();
    this.transformerState = {
      node,
      transformer: attachTransformer(node, this.layer),
    };
  };

  private onSelectComponent = (id: Maybe<string>): void => {
    if (!id) return;

    const newNode: Maybe<Konva.Group> = this.groupsById[id];
    if (!newNode) return;

    const ts = this.transformerState;
    if (!ts || ts.node !== newNode) this.initTransformer(newNode);
  };

  private onSelectModel = ([id, modelName]: [Maybe<string>, string]): void => {
    if (!id) return;

    const node = this.selectionToNode({ kind: 'model', id, modelName });
    if (node) this.initTransformer(node);
  };

  private onUpdateComponentState = (data: [string, T.ComponentState]) => {
    const [componentId, update] = data;
    if (!this.componentsById[componentId]) return;

    const group: Konva.Group = this.groupsById[componentId];

    if (update.offset !== undefined) {
      group.setPosition({ x: update.offset.x, y: update.offset.y });
    }

    if (update.scale !== undefined) {
      group.scale({ x: update.scale.x, y: update.scale.y });
    }
  };

  private onRequestUpdateComponentModel = (
    data: [string, string, string, any],
  ): void => {
    const [componentId, modelName, modelKey, value] = data;
    const component: Maybe<T.Component> = this.componentsById[componentId];
    if (component === undefined) return;

    const model: Maybe<Konva.Shape> = component.graphics.models[modelName];
    if (model === undefined) return;

    this.updateTransformer();
    const newModel = updateKonvaModel(model, modelKey, value);
    this.display.eventBus.emit({
      kind: 'updateComponentModel',
      data: [componentId, modelKey, newModel],
    });
  };

  private onRequestUpdateComponentTexture = (
    data: [string, string, string, any],
  ): void => {
    const [componentId, textureName, textureKey, value] = data;
    const component: Maybe<T.Component> = this.componentsById[componentId];
    if (component === undefined) return;

    const texture = component.graphics.textures[textureName];
    if (texture === undefined) return;

    texture.update({ [textureKey]: value });
    this.display.eventBus.emit({
      kind: 'updateComponentTexture',
      data: [componentId, textureName, texture],
    });
  };

  private onRequestDefaultComponentTexture = (
    data: [string, string, T.TextureKind],
  ): void => {
    const [componentId, textureName, textureKind] = data;
    const component: Maybe<T.Component> = this.componentsById[componentId];
    if (component === undefined) return;

    const texture = defaultTexture(textureKind);

    component.graphics.textures[textureName] = texture;
    this.display.eventBus.emit({
      kind: 'updateComponentTexture',
      data: [componentId, textureName, texture],
    });
  };

  private onSetTransformerVisibility = (visibility: boolean): void => {
    if (this.transformerState) {
      this.transformerState.transformer.visible(visibility);
    }
  };
}
