import * as T from '../types';
import { keyBy, uuid, values } from '../utils';
import { bindControllerKey, stopListening } from '../state/actions';
import { applyGamepadBindings } from './controllers';
import { NextInputListener } from './NextInputListener';

// keyed first by controller id and second by controller key
export type GlobalInput = Record<string, Record<string, T.Input>>;

type GamepadId = string;

const getGamepads = (): (Gamepad | null)[] => [...navigator.getGamepads()];

const forEachGamepad = (
  f: (g: Gamepad | null, n: number) => void,
  gs: (Gamepad | null)[],
): void => {
  for (let i = 0; i < gs.length; i++) {
    f(gs[i], i);
  }
};

export class ControllerManager {
  private nextInputListener: NextInputListener;
  private sources: T.GlobalSourceRefs = {
    gamepads: [],
    keyboard: { kind: 'keyboard' },
  };

  constructor(private store: T.EditorStore) {
    window.addEventListener('gamepadconnected', this.syncGamepadSources);
    window.addEventListener('gamepaddisconnected', this.syncGamepadSources);

    this.nextInputListener = new NextInputListener();

    store.subscribe(() => this.storeSubscriber());
  }

  private syncGamepadSources = (): void => {
    const liveGamepads = getGamepads();
    const gamepadsByIndex = keyBy(this.sources.gamepads, g => g.index);

    forEachGamepad((gamepad, index) => {
      if (!gamepadsByIndex[index] && gamepad) {
        gamepadsByIndex[index] = { kind: 'gamepad', index };
      } else if (gamepadsByIndex[index] && !gamepad) {
        delete gamepadsByIndex[index];
      }
    }, liveGamepads);

    this.sources.gamepads = values(gamepadsByIndex);
  };

  private storeSubscriber = (): void => {
    const state = this.store.getState();
    const { remap } = state.input;

    if (remap && remap.kind === 'controller') {
      switch (remap.inputKind) {
        case 'button': {
          this.nextInputListener.awaitButton((binding) => {
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
          this.nextInputListener.awaitPositiveAxis((binding) => {
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

  awaitButton(callback: T.AwaitButtonCallback): void {
    this.nextInputListener.awaitButton(callback);
  }

  getInput(): GlobalInput {
    const result = {};
    const controllers = this.store.getState().input.controllers;

    const gamepads = getGamepads();
    this.sources.gamepads.forEach(({ index }) => {
      controllers.forEach(controller => {
        const gamepad = gamepads[index] as Gamepad;
        result[controller.id] = applyGamepadBindings(gamepad, controller);
      });
    });

    return result;
  }

  update(): void {
    if (this.nextInputListener.isActive()) {
      this.nextInputListener.update(getGamepads());
    }
  }
}
