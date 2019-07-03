import StickMap, { StickBinding, StickInput } from '../map/StickMap';
import DPadMap, { DPadBinding, DPadInput } from '../map/DPadMap';

export interface GamepadBinding {
  ls: StickBinding;
  rs: StickBinding;
  dpad: DPadBinding;
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

  constructor(binding: GamepadBinding, config) {
    const { ls, rs, dpad } = binding;
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
