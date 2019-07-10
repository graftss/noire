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

export type Dir = 'u' | 'l' | 'd' | 'r';

export interface DPadBinding
  extends BaseBinding,
    Record<Dir, ButtonInputBinding> {
  kind: 'dpad';
}

export type DPadInput = Record<Dir, ButtonInput>;

export const dPadMap: InputMap<DPadBinding, DPadInput> = ({
  u,
  l,
  d,
  r,
}) => gamepad => ({
  u: buttonInputMap(u)(gamepad),
  l: buttonInputMap(l)(gamepad),
  d: buttonInputMap(d)(gamepad),
  r: buttonInputMap(r)(gamepad),
});

export interface StickBinding extends BaseBinding {
  kind: 'stick';
  x: AxisBinding;
  y: AxisBinding;
  button?: ButtonInputBinding;
}

export interface StickInput extends Record<string, RawInput> {
  x: AxisInput;
  y: AxisInput;
  button: ButtonInput;
}

export const stickMap: InputMap<StickBinding, StickInput> = binding => {
  const inputMaps = {
    x: axisMap(binding.x),
    y: axisMap(binding.y),
    button: binding.button && buttonInputMap(binding.button),
  };

  return gamepad => ({
    x: inputMaps.x(gamepad),
    y: inputMaps.y(gamepad),
    button: binding.button && inputMaps.button(gamepad),
  });
};

export type Binding =
  | AxisBinding
  | ButtonInputBinding
  | DPadBinding
  | StickBinding;

export type SimpleBinding = ButtonInputBinding | AxisBinding;

export type SimpleBindingKind = 'axis' | 'button' | 'axisValue';

export type ComplexBinding = StickBinding | DPadBinding;

export type Input =
  | { kind: 'axis'; input: AxisInput }
  | { kind: 'button'; input: ButtonInput }
  | { kind: 'dpad'; input: DPadInput }
  | { kind: 'stick'; input: StickInput };

export type RawInput = AxisInput | ButtonInput | DPadInput | StickInput;

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

    case 'dpad':
      return {
        kind: 'dpad',
        input: dPadMap(binding)(gamepad),
      };

    case 'stick':
      return {
        kind: 'stick',
        input: stickMap(binding)(gamepad),
      };
  }
};
