import Konva from 'konva';
import * as T from '../../types';
import * as events from '../events';
import * as actions from '../../state/actions';
import { defaultKonvaModel, deserializeKonvaModel } from '../model/konva';
import { defaultTexture } from '../texture';
import { DisplayPlugin } from './DisplayPlugin';
import { Display } from '..';

export type KonvaSelectable =
  | { kind: 'component'; id: string }
  | { kind: 'model'; id: string; modelName: string }
  | { kind: 'filter'; id: string; modelName: string; filterIndex: number };

interface TransformerState {
  selection: KonvaSelectable;
  transformer: Konva.Transformer;
  node: Konva.Node;
}

interface StageClickEvent {
  target: Konva.Node;
}

interface DragEndEvent {
  target: { attrs: Vec2 };
}

interface TransformEndEvent {
  target: {
    attrs: {
      rotation: number;
      scaleX: number;
      scaleY: number;
      x: number;
      y: number;
    };
  };
}

type ComponentQueryResult =
  | { component: T.Component; group: Konva.Group }
  | { component: undefined; group: undefined };

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

    const handlers: T.DisplayEventHandler[] = [
      {
        kind: 'requestUpdateDisplayField',
        cb: this.onRequestUpdateDisplayField,
      },
      { kind: 'requestAddComponent', cb: this.onRequestAddComponent },
      { kind: 'requestRemoveComponent', cb: this.onRequestRemoveComponent },
      { kind: 'requestDraw', cb: () => this.layer.draw() },
      { kind: 'requestSelectComponent', cb: this.onRequestSelectComponent },
      { kind: 'requestDeselectComponent', cb: this.onRequestDeselectComponent },
      { kind: 'selectModel', cb: this.onSelectModel },
      { kind: 'setComponentState', cb: this.onSetComponentState },
      { kind: 'requestModelUpdate', cb: this.onRequestModelUpdate },
      { kind: 'requestDefaultModel', cb: this.onRequestDefaultModel },
      { kind: 'requestTextureUpdate', cb: this.onRequestTextureUpdate },
      { kind: 'requestFilterUpdate', cb: this.onRequestFilterUpdate },
      { kind: 'requestRemoveFilter', cb: this.onRequestRemoveFilter },
      { kind: 'requestDefaultTexture', cb: this.onRequestDefaultTexture },
      { kind: 'setTransformerVisibility', cb: this.onSetTransformerVisibility },
    ];

    handlers.forEach(eventBus.on);
  }

  initCanvas(display: T.SerializedDisplay): void {
    const { width, height, backgroundColor } = display;

    this.stage.size({ width, height });
    this.border.size({ width, height });
    this.border.fill(backgroundColor);
  }

  private onStageClick = ({ target }: StageClickEvent) => {
    if (target === this.border) {
      if (this.transformerState) {
        const { selection } = this.transformerState;

        switch (selection.kind) {
          case 'component':
            actions.deselectComponent(selection.id)(this.dispatch);
        }
      }

      this.destroyTransformer();
      this.emit(events.konvaStageClick(this.stage));
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

  private addModel = (componentId: string, group: Konva.Group) => (
    model: Konva.Shape,
  ) => {
    model.on('click', () => {
      actions.selectComponent(componentId)(this.dispatch);
    });
    group.add(model);
  };

  private onGroupDragend = (id: string) => (event: DragEndEvent): void => {
    const { x, y } = event.target.attrs;
    const update: T.ComponentState = { position: { x, y } };
    this.display.emitUpdateComponentState(id, update);
  };

  private onGroupTransformend = (id: string) => (
    event: TransformEndEvent,
  ): void => {
    const { scaleX, scaleY, rotation, x, y } = event.target.attrs;
    const update: T.ComponentState = {
      position: { x, y },
      rotation,
      scale: { x: scaleX, y: scaleY },
    };
    this.display.emitUpdateComponentState(id, update);
  };

  private onRequestUpdateDisplayField = ({
    display,
  }: T.DisplayHandlerData['requestUpdateDisplayField']): void => {
    this.initCanvas(display);
  };

  // we need to add each model to its group before calling `init`
  // on the component, which assumes that each model in the
  // component has a parent.
  // in general, the order of the calls made here is very brittle
  // and should be changed carefully.
  private onRequestAddComponent = (component: T.Component): void => {
    const { id } = component;
    const { position, scale, rotation } = component.state;

    const group = new Konva.Group({ position, scale, rotation });
    group.on('dragend', this.onGroupDragend(id));
    group.on('transformend', this.onGroupTransformend(id));
    this.groupsById[id] = group;
    this.layer.add(group);

    component.modelList().forEach(this.addModel(id, group));
    component.init();
    this.componentsById[id] = component;
  };

  private onRequestRemoveComponent = (id: string): void => {
    const queryResult = this.findComponentById(id);
    if (queryResult) {
      const { component, group } = queryResult;
      if (component && group) {
        group.destroy();
        if (
          this.transformerState &&
          this.transformerState.selection.id === id
        ) {
          this.destroyTransformer();
        }
      }
    }
  };

  private findComponentById(id: Maybe<string>): Maybe<ComponentQueryResult> {
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
  // at the back of the event queue for it to realise anything has changed
  private updateTransformer = (): void => {
    setImmediate(() => {
      if (!this.transformerState) return;
      this.transformerState.transformer.forceUpdate();
    });
  };

  private initTransformer = (
    selection: KonvaSelectable,
    node: Konva.Node,
  ): void => {
    node.draggable(true);
    this.destroyTransformer();
    this.transformerState = {
      selection,
      node,
      transformer: attachTransformer(node, this.layer),
    };
  };

  private onRequestSelectComponent = (id: string): void => {
    const newNode: Maybe<Konva.Group> = this.groupsById[id];
    if (!newNode) return;

    const ts = this.transformerState;
    if (!ts || ts.node !== newNode) {
      this.initTransformer({ kind: 'component', id }, newNode);
    }
    this.emit(events.selectComponent(id));
  };

  private onRequestDeselectComponent = (id: string): void => {
    this.emit(events.deselectComponent(id));
  };

  private onSelectModel = ({
    id,
    modelName,
  }: T.DisplayHandlerData['selectModel']): void => {
    if (!id) return;

    const selection: KonvaSelectable = { kind: 'model', id, modelName };
    const node = this.selectionToNode(selection);
    if (node) this.initTransformer(selection, node);
  };

  private onSetComponentState = ({
    id,
    state,
  }: T.DisplayHandlerData['setComponentState']) => {
    if (!this.componentsById[id]) return;
    const group: Konva.Group = this.groupsById[id];

    if (state.position !== undefined) group.setPosition(state.position);
    if (state.scale !== undefined) group.scale(state.scale);
    if (state.rotation !== undefined) group.rotation(state.rotation);
  };

  private onRequestModelUpdate = ({
    id,
    modelName,
    serializedModel,
  }: T.DisplayHandlerData['requestModelUpdate']): void => {
    const component: Maybe<T.Component> = this.componentsById[id];
    if (component === undefined) return;

    const group = this.groupsById[id];
    const model = deserializeKonvaModel(serializedModel);

    component.setModel(modelName, model);
    this.addModel(id, group)(model);
    this.updateTransformer();

    this.emit(events.setComponentModel(id, modelName, model));
  };

  private onRequestDefaultModel = ({
    id,
    modelName,
    kind,
  }: T.DisplayHandlerData['requestDefaultModel']): void => {
    const component: Maybe<T.Component> = this.componentsById[id];
    if (component === undefined) return;

    const group = this.groupsById[id];
    const model = defaultKonvaModel(kind);

    component.setModel(modelName, model);
    this.addModel(id, group)(model);
    this.updateTransformer();

    this.emit(events.setComponentModel(id, modelName, model));
  };

  private onRequestTextureUpdate = ({
    id,
    textureName,
    texture,
  }: T.DisplayHandlerData['requestTextureUpdate']): void => {
    const component: Maybe<T.Component> = this.componentsById[id];
    if (component === undefined) return;

    const cTexture = component.setSerializedTexture(textureName, texture);
    this.emit(events.setComponentTexture(id, textureName, cTexture));
  };

  private onRequestDefaultTexture = ({
    id,
    textureName,
    kind,
  }: T.DisplayHandlerData['requestDefaultTexture']): void => {
    const component: Maybe<T.Component> = this.componentsById[id];
    if (component === undefined) return;

    const texture = defaultTexture(kind);

    component.graphics.textures[textureName] = texture;
    this.emit(events.setComponentTexture(id, textureName, texture));
  };

  private onRequestFilterUpdate = ({
    id,
    ref,
    filter,
  }: T.DisplayHandlerData['requestFilterUpdate']): void => {
    const component: Maybe<T.Component> = this.componentsById[id];
    if (component === undefined) return;

    component.setInputFilter(ref, filter);
    this.emit(events.setComponentFilters(id, component.filters));
  };

  private onRequestRemoveFilter = ({
    id,
    ref,
  }: T.DisplayHandlerData['requestRemoveFilter']): void => {
    const component: Maybe<T.Component> = this.componentsById[id];
    if (component === undefined) return;

    component.removeInputFilter(ref);
    // this.emit(events.setComponentFilters(id, component.filters));
  };

  private onSetTransformerVisibility = (visibility: boolean): void => {
    if (this.transformerState) {
      this.transformerState.transformer.visible(visibility);
    }
  };
}
