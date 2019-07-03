import { ButtonInput } from './ButtonMap';

export interface AxisValueBindings {
  axis: number;
  value: number;
  marginOfError?: number;
}

export default class AxisValueMap {
  bindings: AxisValueBindings;

  constructor(bindings: AxisValueBindings) {
    this.bindings = bindings;
  }

  getInput(gamepad: Gamepad): ButtonInput {
    const { axis, value, marginOfError = 0.001 } = this.bindings;

    return {
      pressed: Math.abs(gamepad.axes[axis] - value) < marginOfError,
    };
  }
}
