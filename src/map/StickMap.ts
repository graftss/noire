export interface StickConfig {
  deadzone?: number;
}

export interface StickBinding {
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
  binding: StickBinding;
  config: StickConfig;

  constructor(binding: StickBinding, config: StickConfig) {
    this.binding = binding;
    this.config = config;
  }

  normalizeAxis(x) {
    return Math.abs(x) < (this.config.deadzone || 0) ? 0 : x;
  }

  getInput(gamepad: Gamepad): StickInput {
    const { hAxis, vAxis, downIndex } = this.binding;

    return {
      x: this.normalizeAxis(gamepad.axes[hAxis]),
      y: this.normalizeAxis(gamepad.axes[vAxis]),
      pressed: gamepad.buttons[downIndex].pressed,
    };
  }
}
