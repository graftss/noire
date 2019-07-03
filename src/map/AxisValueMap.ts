import { ButtonInput } from './ButtonMap';

export interface AxisValueBinding {
  axis: number;
  value: number;
  marginOfError?: number;
}

export default class AxisValueMap {
  binding: AxisValueBinding;

  constructor(binding: AxisValueBinding) {
    this.binding = binding;
  }

  getInput(gamepad: Gamepad): ButtonInput {
    const { axis, value, marginOfError = 0.001 } = this.binding;

    return {
      pressed: Math.abs(gamepad.axes[axis] - value) < marginOfError,
    };
  }
}
