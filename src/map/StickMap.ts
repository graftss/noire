export interface StickConfig {
  deadzone?: number;
}

export interface StickBindings {
  h: number;
  v: number;
  down?: number;
}

export interface StickInput {
  x: number;
  y: number;
  pressed: boolean;
}

export default class StickMap {
  hIndex: number;
  vIndex: number;
  downIndex: number;
  config: StickConfig;

  constructor(bindings: StickBindings, config: StickConfig) {
    const { h, v, down } = bindings;

    this.hIndex = h;
    this.vIndex = v;
    this.downIndex = down;
    this.config = config;
  }

  normalizeAxis(x) {
    return Math.abs(x) < (this.config.deadzone || 0) ? 0 : x;
  }

  getInput(gamepad: Gamepad): StickInput {
    return {
      x: this.normalizeAxis(gamepad.axes[this.hIndex]),
      y: this.normalizeAxis(gamepad.axes[this.vIndex]),
      pressed: gamepad.buttons[this.downIndex].pressed,
    };
  }
}
