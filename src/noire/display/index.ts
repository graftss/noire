import * as T from '../types';
import * as actions from '../state/actions';
import * as selectors from '../state/selectors';
import * as events from './events';
import { deserializeComponent } from './component';
import { ComponentManager } from './ComponentManager';
import { KonvaComponentPlugin } from './plugin/KonvaComponentPlugin';
import { DisplayEventBus } from './events/DisplayEventBus';

export class Display {
  cm: ComponentManager;
  config: T.NoireConfig;
  store: T.EditorStore;
  eventBus: DisplayEventBus;
  konvaPlugin: KonvaComponentPlugin;

  constructor(
    config: T.NoireConfig,
    store: T.EditorStore,
    eventBus: DisplayEventBus,
  ) {
    this.config = config;
    this.store = store;
    this.eventBus = eventBus;

    this.cm = new ComponentManager(this.eventBus);
    this.konvaPlugin = new KonvaComponentPlugin(config, this);

    // sync display with the store's initial state
    this.loadDisplay(selectors.activeDisplay(store.getState()));

    this.eventBus.on({ kind: 'requestClearDisplay', cb: this.clearDisplay });
    this.eventBus.on({ kind: 'requestLoadDisplay', cb: this.loadDisplay });
  }

  private clearDisplay = (): void => {
    this.cm.forEachComponent(c => {
      this.eventBus.emit(events.requestRemoveComponent(c.id));
    });
  };

  private loadDisplay = (display: T.SerializedDisplay): void => {
    this.clearDisplay();
    this.konvaPlugin.initCanvas(display);
    display.components
      .map(deserializeComponent)
      .forEach(c => this.eventBus.emit(events.requestAddComponent(c)));
  };

  emitUpdateComponentState(id: string, state: T.ComponentState): void {
    this.store.dispatch(actions.setComponentState(id, state));
    this.eventBus.emit(events.setComponentState(id, state));
  }

  emitUpdateComponentModel(
    id: string,
    modelName: string,
    serialModel: T.SerializedKonvaModel,
    model: T.KonvaModel,
  ): void {
    actions.setModel({ id, modelName, model: serialModel })(
      this.store.dispatch,
    );
    this.eventBus.emit(events.setComponentModel(id, modelName, model));
  }

  draw(): void {
    this.eventBus.emit(events.requestDraw());
  }

  update(input: T.GlobalControllerInput, dt: number): void {
    this.cm.update(input, dt);
  }
}
