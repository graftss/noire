import Konva from 'konva';

import * as T from '../types';
import { applyBinding } from '../gamepad/applyBinding';
import { ComponentManager } from './ComponentManager';
import { ComponentTransformerPlugin } from './plugin/ComponentTransformerPlugin';
import { DisplayEventBus } from './DisplayEventBus';
import { DisplayPlugin } from './plugin/DisplayPlugin';
import { NextInputListener } from './NextInputListener';
import { deserializeComponent } from '../component/deserializeComponent';
import { DisplayState, EditorStore } from '../../state/types';

export class Display {
  private nextInputListener: NextInputListener;
  private eventBus: DisplayEventBus;
  private cm: ComponentManager;
  private lastState: DisplayState;
  private plugins: DisplayPlugin[];

  constructor(
    private stage: Konva.Stage,
    private layer: Konva.Layer,
    private store: EditorStore,
  ) {
    this.stage = stage;
    this.layer = layer;
    this.nextInputListener = new NextInputListener();
    this.eventBus = new DisplayEventBus(stage);
    this.plugins = [new ComponentTransformerPlugin(this.eventBus)];

    this.cm = new ComponentManager(stage, layer, this.eventBus);

    this.checkForStateChange();
    store.subscribe(this.checkForStateChange);
  }

  private checkForStateChange = (): void => {
    const newState = this.store.getState().display;
    if (this.lastState !== newState) {
      this.syncWithState(newState);
    }
  };

  private syncWithState(state: DisplayState): void {
    this.lastState = state;
    this.cm.reset(state.components.map(deserializeComponent));
  }

  private getInputDict(gamepad: Gamepad): Record<T.BindingId, T.Input> {
    const result = {};

    this.lastState.bindings.forEach(
      ({ id, binding }) => (result[id] = applyBinding(binding, gamepad)),
    );

    return result;
  }

  draw(): void {
    this.layer.draw();
  }

  update(gamepad: Gamepad, dt: number): void {
    this.nextInputListener.update(gamepad);

    const inputDict = this.getInputDict(gamepad);
    this.cm.update(inputDict, dt);
  }
}
