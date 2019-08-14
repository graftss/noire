import * as T from '../types';
import {
  deselectComponent,
  selectComponent,
  setComponentModel,
  setComponentState,
} from '../state/actions';
import * as events from './events';
import { deserializeComponent } from './component';
import { ComponentManager } from './ComponentManager';
import { KonvaComponentPlugin } from './plugin/KonvaComponentPlugin';
import { DisplayEventBus } from './events/DisplayEventBus';
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
      cb: (id: string) => dispatch(selectComponent(id)),
    });

    this.eventBus.on({
      kind: 'deselectComponent',
      cb: (id: string) => dispatch(deselectComponent(id)),
    });
  }

  private syncWithState(state: T.EditorState): void {
    this.cm.sync(state.display.components.map(deserializeComponent));
  }

  emitUpdateComponentState(id: string, state: T.ComponentState): void {
    this.store.dispatch(setComponentState(id, state));
    this.eventBus.emit(events.setComponentState(id, state));
  }

  emitUpdateComponentModel(
    id: string,
    modelName: string,
    serialModel: T.SerializedKonvaModel,
    model: T.KonvaModel,
  ): void {
    this.store.dispatch(setComponentModel(id, modelName, serialModel));
    this.eventBus.emit(events.setComponentModel(id, modelName, model));
  }

  draw(): void {
    this.eventBus.emit(events.requestDraw());
  }

  update(input: T.GlobalControllerInput, dt: number): void {
    this.cm.update(input, dt);
  }
}
