import * as T from '../types';

export type InputMap<T, U> = (binding: T) => (g: Gamepad) => U;

export type BindingId = string;

export interface BaseBinding {
  id: BindingId;
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

export interface DPadBindingRef extends BaseBinding, Record<Dir, BindingId> {
  kind: 'dpadref';
}

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
  down?: ButtonInputBinding;
}

export interface StickBindingRef extends BaseBinding {
  kind: 'stickref';
  x: BindingId;
  y: BindingId;
  down?: BindingId;
}

export interface StickInput {
  x: AxisInput;
  y: AxisInput;
  down: ButtonInput;
}

export const stickMap: InputMap<StickBinding, StickInput> = binding => {
  const inputMaps = {
    h: axisMap(binding.x),
    v: axisMap(binding.y),
    down: binding.down && buttonInputMap(binding.down),
  };

  return gamepad => ({
    x: inputMaps.h(gamepad),
    y: inputMaps.v(gamepad),
    down: binding.down && inputMaps.down(gamepad),
  });
};

export type Binding =
  | AxisBinding
  | ButtonInputBinding
  | DPadBinding
  | StickBinding;

// TODO: add `RawInput` (or something) export type to characterize just the
// `input` property of the `Input` export type, to better export type the input
// argument of `Component.input`.

export type Input =
  | { kind: 'axis'; input: AxisInput }
  | { kind: 'button'; input: ButtonInput }
  | { kind: 'dpad'; input: DPadInput }
  | { kind: 'stick'; input: StickInput };

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
