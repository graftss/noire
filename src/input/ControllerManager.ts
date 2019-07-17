import * as T from '../types';
import {
  updateComponentKey,
  updateControllerBindings,
  stopListening,
} from '../state/actions';
import {
  controllerBindingsWithBinding,
  allControllerBindings,
} from '../state/selectors';
import { parseControllerBindings } from './controller';
import { NextInputListener } from './NextInputListener';
import { dereference } from './source';

// keyed first by controller id and second by controller key
export type GlobalControllerInput = Dict<Dict<T.Input>>;

const gamepadSourceRefs: T.GamepadSourceRef[] = [0, 1, 2, 3].map(index => ({
  kind: 'gamepad',
  index,
}));

export class ControllerManager {
  private nextInputListener: NextInputListener;
  private sourceRefs: T.GlobalSourceRefs = {
    gamepads: gamepadSourceRefs,
    keyboard: { kind: 'keyboard' },
  };

  constructor(private store: T.EditorStore) {
    this.nextInputListener = new NextInputListener();
    store.subscribe(() => this.storeSubscriber());
  }

  private onAwaitedControllerBinding = (bindingsId: string, key: string) => (
    binding: T.Binding,
  ): void => {
    this.store.dispatch(stopListening());
    this.store.dispatch(updateControllerBindings({ bindingsId, key, binding }));
  };

  private onAwaitedComponentBinding = (
    componentId: string,
    inputKey: string,
  ) => (binding: T.Binding): void => {
    const state = this.store.getState();
    const maybeBindings = controllerBindingsWithBinding(state.input, binding);

    if (maybeBindings) {
      const { bindings, key } = maybeBindings;

      this.store.dispatch(
        updateComponentKey({
          componentId,
          inputKey,
          bindingsId: bindings.id,
          bindingsKey: key,
        }),
      );
    } else {
      this.store.dispatch(updateComponentKey({ componentId, inputKey }));
    }

    this.store.dispatch(stopListening());
  };

  private storeSubscriber = (): void => {
    const { remap } = this.store.getState().input;
    if (!remap) return;

    switch (remap.kind) {
      case 'controller': {
        const handler = this.onAwaitedControllerBinding(
          remap.controllerId,
          remap.key,
        );

        switch (remap.inputKind) {
          case 'button':
            return this.nextInputListener.awaitButton(handler);
          case 'axis':
            return this.nextInputListener.awaitPositiveAxis(handler);
        }

        break;
      }

      case 'component': {
        const handler = this.onAwaitedComponentBinding(
          remap.componentId,
          remap.key,
        );

        switch (remap.inputKind) {
          case 'button':
            return this.nextInputListener.awaitButton(handler);
          case 'axis':
            return this.nextInputListener.awaitPositiveAxis(handler);
        }

        break;
      }
    }
  };

  getInput(): GlobalControllerInput {
    const result = {};
    const controllerBindings = allControllerBindings(
      this.store.getState().input,
    );

    this.sourceRefs.gamepads.forEach(ref => {
      controllerBindings.forEach(bindings => {
        const source = dereference(ref);
        const keymap = parseControllerBindings(source, bindings);
        if (keymap) result[bindings.id] = keymap;
      });
    });

    return result;
  }

  update(): void {
    if (this.nextInputListener.isActive()) {
      this.nextInputListener.update(this.sourceRefs);
    }
  }
}
