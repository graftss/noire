import * as T from '../types';
import { bindControllerKey, stopListening } from '../state/actions';
import { applyControllerKeymap } from './controllers';
import { NextInputListener } from './NextInputListener';
import { dereferenceSource } from './sources';

// keyed first by controller id and second by controller key
export type GlobalInput = Record<string, Record<string, T.Input>>;

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

  private storeSubscriber = (): void => {
    const state = this.store.getState();
    const { remap } = state.input;

    if (remap && remap.kind === 'controller') {
      switch (remap.inputKind) {
        case 'button': {
          this.nextInputListener.awaitButton(binding => {
            this.store.dispatch(stopListening());
            this.store.dispatch(
              bindControllerKey({
                controllerId: remap.controllerId,
                key: remap.key,
                binding,
              }),
            );
          });

          break;
        }

        case 'axis': {
          this.nextInputListener.awaitPositiveAxis(binding => {
            this.store.dispatch(stopListening());
            this.store.dispatch(
              bindControllerKey({
                controllerId: remap.controllerId,
                key: remap.key,
                binding,
              }),
            );
          });

          break;
        }
      }
    }
  };

  private sourceRefArray(): T.InputSourceRef[] {
    const { gamepads, keyboard } = this.sourceRefs;
    return [...gamepads, keyboard];
  }

  getInput(): GlobalInput {
    const result = {};
    const controllers = this.store.getState().input.controllers;

    this.sourceRefs.gamepads.forEach(ref => {
      controllers.forEach(controller => {
        const source = dereferenceSource(ref);
        const keymap = applyControllerKeymap(source, controller);
        if (keymap) result[controller.id] = keymap;
      });
    });

    return result;
  }

  update(): void {
    if (this.nextInputListener.isActive()) {
      this.nextInputListener.update(this.sourceRefArray());
    }
  }
}
