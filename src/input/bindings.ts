import * as T from '../types';
import { clone, equals } from '../utils';

export type BindingParser<B, I> = (b: B, s: T.InputSource) => Maybe<I>;

export interface BaseBinding {
  kind: string;
  sourceRef: T.InputSourceRef;
}

export interface AxisBinding extends BaseBinding {
  kind: 'axis';
  index: number;
  inverted: boolean;
  deadzone?: number;
}

export type RawAxisInput = number;

export interface AxisInput {
  kind: 'axis';
  input: RawAxisInput;
}

export const axisMap: BindingParser<AxisBinding, AxisInput> = (
  binding,
  source,
) => {
  const { index, inverted, deadzone = 0 } = binding;
  const kind = 'axis';

  switch (source.kind) {
    case 'gamepad': {
      if (!source.gamepad) return;
      const rawValue = source.gamepad.axes[index] * (inverted ? -1 : 1);
      const input = Math.abs(rawValue) < deadzone ? 0 : rawValue;
      return { kind, input };
    }
  }
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

export type RawButtonInput = boolean;

export interface ButtonInput {
  kind: 'button';
  input: RawButtonInput;
}

export const axisValueMap: BindingParser<AxisValueBinding, ButtonInput> = (
  binding,
  source,
) => {
  const { axis, value, marginOfError = 0.001 } = binding;
  const kind = 'button';

  switch (source.kind) {
    case 'gamepad': {
      if (!source.gamepad) return;
      const input = Math.abs(source.gamepad.axes[axis] - value) < marginOfError;
      return { kind, input };
    }
  }
};

export const buttonMap: BindingParser<ButtonBinding, ButtonInput> = (
  binding,
  source,
) => {
  const { index } = binding;
  const kind = 'button';

  switch (source.kind) {
    case 'gamepad': {
      if (!source.gamepad) return;
      return { kind, input: source.gamepad.buttons[index].pressed };
    }
  }
};

export const buttonBindingParser: BindingParser<
  ButtonInputBinding,
  ButtonInput
> = (binding, source) =>
  binding.kind === 'button'
    ? buttonMap(binding, source)
    : axisValueMap(binding, source);

export type Binding = AxisBinding | ButtonInputBinding;

export type BindingKind = 'axis' | 'button' | 'axisValue';

export type Input = AxisInput | ButtonInput;
export type InputKind = Input['kind'];
export type RawInput = Input['input'];

export type Kinds<I extends Dict<Input>> = {
  [K in keyof I]: I[K]['kind'];
};

export type Raw<I extends Dict<Input>> = {
  [K in keyof I]: I[K]['input'];
};

export const rawifyInputDict = <I extends Dict<Input>>(i: I): Raw<I> => {
  const result = clone(i);

  for (const key in result) {
    result[key] = result[key].input;
  }

  return result;
};

export const bindingToInputKind = (bindingKind: BindingKind): InputKind => {
  switch (bindingKind) {
    case 'button':
    case 'axisValue':
      return 'button';
    case 'axis':
      return 'axis';
  }
};

export const applyBinding = (
  binding: Binding,
  source: T.InputSource,
): Maybe<Input> => {
  switch (binding.kind) {
    case 'button':
    case 'axisValue':
      return buttonBindingParser(binding, source);
    case 'axis':
      return axisMap(binding, source);
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

export const areBindingsEqual = (b1: Binding, b2: Binding): boolean =>
  equals(b1, b2);

export function defaultInputByKind(kind: 'axis'): T.AxisInput;
export function defaultInputByKind(kind: 'button'): T.ButtonInput;
export function defaultInputByKind(kind: T.InputKind): T.Input;
export function defaultInputByKind(kind: T.InputKind): T.Input {
  switch (kind) {
    case 'axis':
      return { kind, input: 0 };
    case 'button':
      return { kind, input: false };
  }
}
