export interface StickConfig {
  deadzone?: number;
}

export interface StickBindings {
  hAxis: number;
  vAxis: number;
  downIndex?: number;
}

export interface StickInput {
  x: number;
  y: number;
  pressed: boolean;
}

export default class StickMap {
  bindings: StickBindings;
  config: StickConfig;

  constructor(bindings: StickBindings, config: StickConfig) {
    this.bindings = bindings;
    this.config = config;
  }

  normalizeAxis(x) {
    return Math.abs(x) < (this.config.deadzone || 0) ? 0 : x;
  }

  getInput(gamepad: Gamepad): StickInput {
    const { hAxis, vAxis, downIndex } = this.bindings;

    return {
      x: this.normalizeAxis(gamepad.axes[hAxis]),
      y: this.normalizeAxis(gamepad.axes[vAxis]),
      pressed: gamepad.buttons[downIndex].pressed,
    };
  }
}
