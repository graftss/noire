import StickMap, { StickBindings } from './StickMap';
import DPadMap, { DPadBindings } from './DPadMap';

export interface GamepadBindings {
  ls: StickBindings;
  rs: StickBindings;
  dpad: DPadBindings;
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
