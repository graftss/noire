import * as T from '../types';

export type InputMap<T, U> = (binding: T) => (g: Gamepad) => U;

export type BindingId = string;

export interface BaseBinding {
  id?: BindingId;
  kind: string;
  sourceRef: T.InputSourceRef;
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

export type BindingKind = 'axis' | 'button' | 'axisValue';

export type Input =
  | { kind: 'axis'; input: AxisInput }
  | { kind: 'button'; input: ButtonInput };

export type InputKind = 'axis' | 'button';

export type RawInput = AxisInput | ButtonInput;

export type Keymap = Record<string, Maybe<Input>>;

export const bindingToInputKind = (bindingKind: BindingKind): InputKind => {
  switch (bindingKind) {
    case 'button':
    case 'axisValue':
      return 'button';
    case 'axis':
      return 'axis';
  }
};

export const applyGamepadBinding = (
  gamepad: Gamepad,
  binding: Binding,
): Input => {
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

export const applyBinding = (
  source: T.InputSource,
  binding: Binding,
): Maybe<Input> => {
  switch (source.kind) {
    case 'gamepad':
      return source.gamepad
        ? applyGamepadBinding(source.gamepad, binding)
        : undefined;
  }
};

export const stringifyBinding = (
  b: Maybe<Binding>,
  listened: boolean = false,
): string => {
  if (listened) return '(listening)';
  if (b === undefined) return 'NONE';

  let sourceStr, bindingStr;

  switch (b.sourceRef.kind) {
    case 'gamepad':
      sourceStr = `Player ${b.sourceRef.index + 1}`;
      break;
    case 'keyboard':
      sourceStr = 'Keyboard';
      break;
    default:
      sourceStr = '(??)';
  }

  switch (b.kind) {
    case 'axis':
      bindingStr = `Axis ${b.index}${b.inverted ? '-' : '+'}`;
      break;
    case 'button':
      bindingStr = `Button ${b.index}`;
      break;
    case 'axisValue':
      bindingStr = `Axis ${b.axis} @ ${b.value}`;
      break;
    default:
      bindingStr = '(??)';
  }

  return `${sourceStr}, ${bindingStr}`;
};
