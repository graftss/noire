import * as T from '../types';
import { keyBy, uuid, values } from '../utils';
import { applyGamepadBindings } from './controllers';

// keyed first by controller id and second by controller key
export type GlobalInput = Record<string, Record<string, T.Input>>;

interface GlobalInputSources {
  gamepads?: (T.GamepadSource)[];
}

type GamepadId = string;

const getGamepads = (): Gamepad[] => navigator.getGamepads();

const forEachGamepad = (
  f: (f: Gamepad, n: number) => void,
  gs: Gamepad[],
): void => {
  for (let i = 0; i < gs.length; i++) {
    f(gs[i], i);
  }
};

export class ControllerManager {
  private sources: GlobalInputSources = {
    gamepads: [],
  };

  constructor(private store: T.EditorStore) {
    window.addEventListener('gamepadconnected', this.syncGamepadSources);
    window.addEventListener('gamepaddisconnected', this.syncGamepadSources);
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
}
