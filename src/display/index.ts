import Konva from 'konva';
import * as T from '../types';
import {
  selectComponent,
  updateComponentModel,
  updateComponentState,
} from '../state/actions';
import { deserializeComponent } from './component';
import { ComponentManager } from './ComponentManager';
import { KonvaComponentPlugin } from './plugin/KonvaComponentPlugin';
import { DisplayEventBus } from './DisplayEventBus';
import { DisplayPlugin } from './plugin/DisplayPlugin';

export class Display {
  private plugins: DisplayPlugin[];
  cm: ComponentManager;
  config: T.NoireConfig;
  store: T.EditorStore;
  eventBus: DisplayEventBus;

  constructor(
    config: T.NoireConfig,
    store: T.EditorStore,
    eventBus: DisplayEventBus,
  ) {
    this.config = config;
    this.store = store;
    this.eventBus = eventBus;

    const { getState, dispatch } = store;
    this.cm = new ComponentManager(this.eventBus);
    this.plugins = [new KonvaComponentPlugin(config, this)];

    // sync display with the store's initial state
    this.syncWithState(getState());

    this.eventBus.on({
      kind: 'selectComponent',
      cb: (id: Maybe<string>) => dispatch(selectComponent(id)),
    });

    this.eventBus.on({
      kind: 'stageClick',
      cb: () => dispatch(selectComponent()),
    });
  }

  private syncWithState(state: T.EditorState): void {
    this.cm.sync(state.display.components.map(deserializeComponent));
  }

  emitUpdateComponentState(id: string, state: T.ComponentState): void {
    this.store.dispatch(updateComponentState(id, state));
    this.eventBus.emit({ kind: 'updateComponentState', data: [id, state] });
  }

  emitUpdateComponentModel(
    id: string,
    modelName: string,
    serialModel: T.SerializedKonvaModel,
    model: Konva.Shape,
  ): void {
    this.store.dispatch(updateComponentModel(id, modelName, serialModel));
    this.eventBus.emit({
      kind: 'updateComponentModel',
      data: [id, modelName, model],
    });
  }

  draw(): void {
    this.eventBus.emit({ kind: 'requestDraw', data: undefined });
  }

  update(input: T.GlobalControllerInput, dt: number): void {
    this.cm.update(input, dt);
  }
}
