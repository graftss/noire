import StickMap, { StickBindings, StickInput } from '../map/StickMap';
import DPadMap, { DPadBindings, DPadInput } from '../map/DPadMap';

export interface GamepadBindings {
  ls: StickBindings;
  rs: StickBindings;
  dpad: DPadBindings;
}

export interface GamepadInput {
  ls: StickInput;
  rs: StickInput;
  dpad: DPadInput;
}

export default class GamepadMap {
  ls: StickMap;
  rs: StickMap;
  dpad: DPadMap;

  constructor(bindings: GamepadBindings, config) {
    const { ls, rs, dpad } = bindings;
    this.ls = new StickMap(ls, config);
    this.rs = new StickMap(rs, config);
    this.dpad = new DPadMap(dpad);
  }

  getInput(gamepad: Gamepad) {
    if (!gamepad) return undefined;

    return {
      ls: this.ls.getInput(gamepad),
      rs: this.rs.getInput(gamepad),
      dpad: this.dpad.getInput(gamepad),
    };
  }
}
