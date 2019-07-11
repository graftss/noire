import * as T from '../types';

export type InputMap<T, U> = (binding: T) => (g: Gamepad) => U;

export type BindingId = string;

export interface BaseBinding {
  id?: BindingId;
  kind: string;
}

export interface AxisBinding extends BaseBinding {
  kind: 'axis';
  index: number;
  inverted: boolean;
  deadzone?: number;
}

export type AxisInput = number;

export const axisMap: InputMap<AxisBinding, AxisInput> = binding => gamepad => {
  const { index, inverted, deadzone = 0 } = binding;

  const raw = gamepad.axes[index] * (inverted ? -1 : 1);
  return Math.abs(raw) < deadzone ? 0 : raw;
};

export interface AxisValueBinding extends BaseBinding {
  kind: 'axisValue';
  axis: number;
  value: number;
  marginOfError?: number;
}

export interface ButtonBinding extends BaseBinding {
  kind: 'button';
  index: number;
}

export type ButtonInputBinding = ButtonBinding | AxisValueBinding;

export interface ButtonInput {
  pressed: boolean;
}

export const axisValueMap: InputMap<
  AxisValueBinding,
  ButtonInput
> = binding => gamepad => {
  const { axis, value, marginOfError = 0.001 } = binding;

  return {
    pressed: Math.abs(gamepad.axes[axis] - value) < marginOfError,
  };
};

export const buttonMap: InputMap<
  ButtonBinding,
  ButtonInput
> = binding => gamepad => {
  return { pressed: gamepad.buttons[binding.index].pressed };
};

export const buttonInputMap: InputMap<
  ButtonInputBinding,
  ButtonInput
> = binding => gamepad =>
  binding.kind === 'button'
    ? buttonMap(binding)(gamepad)
    : axisValueMap(binding)(gamepad);

export type Binding = AxisBinding | ButtonInputBinding;

export type SimpleBindingKind = 'axis' | 'button' | 'axisValue';

export type Input =
  | { kind: 'axis'; input: AxisInput }
  | { kind: 'button'; input: ButtonInput };

export type RawInput = AxisInput | ButtonInput;

export const applyBinding = (
  binding: Binding,
  gamepad: Gamepad,
): Input | undefined => {
  switch (binding.kind) {
    case 'axis':
      return {
        kind: 'axis',
        input: axisMap(binding)(gamepad),
      };

    case 'button':
    case 'axisValue':
      return {
        kind: 'button',
        input: buttonInputMap(binding)(gamepad),
      };
  }
};
