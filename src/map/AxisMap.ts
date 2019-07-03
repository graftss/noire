export interface AxisBinding {
  index: number;
  inverted: boolean;
}

export interface AxisConfig {
  deadzone?: number;
}

export type AxisInput = number;

export default class AxisMap {
  binding: AxisBinding;
  config: AxisConfig;

  constructor(binding: AxisBinding, config: AxisConfig = {}) {
    this.binding = binding;
    this.config = config;
  }

  getInput(gamepad: Gamepad): AxisInput {
    const { index, inverted } = this.binding;
    const { deadzone = 0 } = this.config;

    const raw = gamepad.axes[index] * (inverted ? -1 : 1);
    return Math.abs(raw) < deadzone ? 0 : raw;

  }
}
