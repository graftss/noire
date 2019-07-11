import * as T from '../types';
import { keyBy, uuid, values } from '../utils';
import { applyGamepadBindings } from './controllers';
import { NextInputListener } from './NextInputListener';

// keyed first by controller id and second by controller key
export type GlobalInput = Record<string, Record<string, T.Input>>;

type GamepadId = string;

const getGamepads = (): Gamepad[] => [...navigator.getGamepads()];

const forEachGamepad = (
  f: (f: Gamepad, n: number) => void,
  gs: Gamepad[],
): void => {
  for (let i = 0; i < gs.length; i++) {
    f(gs[i], i);
  }
};

export class ControllerManager {
  private nextInputListener: NextInputListener;
  private sources: T.GlobalSources = {
    gamepads: [],
    keyboard: { kind: 'keyboard', id: 'KEYBOARD_ID' },
  };

  constructor(private store: T.EditorStore) {
    window.addEventListener('gamepadconnected', this.syncGamepadSources);
    window.addEventListener('gamepaddisconnected', this.syncGamepadSources);

    this.nextInputListener = new NextInputListener();
  }

  private syncGamepadSources = (): void => {
    const liveGamepads = getGamepads();
    const gamepadsByIndex = keyBy(this.sources.gamepads, g => g.index);

    forEachGamepad((gamepad, index) => {
      if (!gamepadsByIndex[index] && gamepad) {
        gamepadsByIndex[index] = { kind: 'gamepad', id: uuid(), index };
      } else if (gamepadsByIndex[index] && !gamepad) {
        gamepadsByIndex[index] = null;
      }
    }, liveGamepads);

    this.sources.gamepads = values(gamepadsByIndex);
  };

  awaitButton(callback: T.AwaitButtonCallback): void {
    this.nextInputListener.awaitButton(callback);
  }

  getInput(): GlobalInput {
    const result = {};

    const controllersById = keyBy(
      this.store.getState().input.controllers,
      c => c.id,
    );

    const gamepads = getGamepads();
    this.sources.gamepads.forEach(({ id, index }) => {
      const gamepadMap = controllersById[id] as T.GamepadMap;
      const gamepad = gamepads[index];

      if (gamepadMap && gamepad) {
        result[id] = applyGamepadBindings(gamepad, gamepadMap);
      }
    });

    return result;
  }

  update(): void {
    if (this.nextInputListener.isActive()) {
      this.nextInputListener.update(getGamepads());
    }
  }
}
