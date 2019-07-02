import StickMap, { StickBindings } from './StickMap';

export interface GamepadBindings {
  ls: StickBindings;
  rs: StickBindings;
}

export default class GamepadMap {
  ls: StickMap;
  rs: StickMap;

  constructor(bindings: GamepadBindings, config) {
    const { ls, rs } = bindings;
    this.ls = new StickMap(ls, config);
    this.rs = new StickMap(rs, config);
  }

  getInput(gamepad) {
    if (!gamepad) return undefined;

    return {
      ls: this.ls.getInput(gamepad),
      rs: this.rs.getInput(gamepad),
    };
  }
}
