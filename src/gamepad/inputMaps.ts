export type InputMap<T, U> = (binding: T) => (g: Gamepad) => U;

export type Binding =
  { kind: 'axis', binding: AxisBinding } |
  { kind: 'button', binding: ButtonInputBinding } |
  { kind: 'dpad', binding: DPadBinding } |
  { kind: 'stick', binding: StickBinding };

// TODO: add `RawInput` (or something) type to characterize just the
// `input` property of the `Input` type, to better type the input
// argument of `Component.input`.

export type Input =
  { kind: 'axis', input: AxisInput } |
  { kind: 'button', input: ButtonInput } |
  { kind: 'dpad', input: DPadInput } |
  { kind: 'stick', input: StickInput };

export interface AxisBinding {
  index: number;
  inverted: boolean;
  deadzone?: number;
}

export type AxisInput = number;

export const axisMap: InputMap<AxisBinding, AxisInput> = (
  binding => gamepad => {
   const { index, inverted, deadzone = 0 } = binding;

   const raw = gamepad.axes[index] * (inverted ? -1 : 1);
   return Math.abs(raw) < deadzone ? 0 : raw;
  }
);

export interface AxisValueBinding {
  axis: number;
  value: number;
  marginOfError?: number;
}

export interface ButtonBinding {
  index: number;
}

export type ButtonInputBinding = {
  kind: 'button';
  binding: ButtonBinding;
} | {
  kind: 'axisValue';
  binding: AxisValueBinding;
};

export interface ButtonInput {
  pressed: boolean;
}

export const axisValueMap: InputMap<AxisValueBinding, ButtonInput> = (
  binding => gamepad => {
    const { axis, value, marginOfError = 0.001 } = binding;

    return {
      pressed: Math.abs(gamepad.axes[axis] - value) < marginOfError,
    };
  }
);

export const buttonMap: InputMap<ButtonBinding, ButtonInput> = (
  binding => gamepad => {
    return { pressed: gamepad.buttons[binding.index].pressed };
  }
);

export const buttonInputMap: InputMap<ButtonInputBinding, ButtonInput> = (
  binding => gamepad => binding.kind === 'button' ?
    buttonMap(binding.binding)(gamepad) :
    axisValueMap(binding.binding)(gamepad)
);

export interface DPadDict<T> { u: T; l: T; d: T; r: T; }

export type DPadBinding = DPadDict<ButtonInputBinding>;

export type DPadInput = DPadDict<ButtonInput>

const dPadDictMap = <T, U>(
  f: (a: T) => U,
  dict: DPadDict<T>,
): DPadDict<U> => ({
  u: f(dict.u),
  l: f(dict.l),
  d: f(dict.d),
  r: f(dict.r),
});

export const dPadMap: InputMap<DPadBinding, DPadInput> = (
  binding => gamepad => (
    dPadDictMap((bb: ButtonInputBinding) => buttonInputMap(bb)(gamepad), binding)
  )
);

export interface StickBinding {
  h: AxisBinding;
  v: AxisBinding;
  down?: ButtonBinding;
}

export interface StickInput {
  x: AxisInput;
  y: AxisInput;
  down: ButtonInput;
}

export const stickMap: InputMap<StickBinding, StickInput> = (
  binding => {
    const inputMaps = {
      h: axisMap(binding.h),
      v: axisMap(binding.v),
      down: buttonMap(binding.down),
    };

    return gamepad => ({
      x: inputMaps.h(gamepad),
      y: inputMaps.v(gamepad),
      down: inputMaps.down(gamepad),
    });
  }
);
