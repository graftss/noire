import { Component } from './component';

export type InputMap<T, U> = (binding: T) => (g: Gamepad) => U;

export type Binding =
  | { kind: 'axis'; binding: AxisBinding }
  | { kind: 'button'; binding: ButtonInputBinding }
  | { kind: 'dpad'; binding: DPadBinding }
  | { kind: 'stick'; binding: StickBinding };

// TODO: add `RawInput` (or something) export type to characterize just the
// `input` property of the `Input` export type, to better export type the input
// argument of `Component.input`.

export type Input =
  | { kind: 'axis'; input: AxisInput }
  | { kind: 'button'; input: ButtonInput }
  | { kind: 'dpad'; input: DPadInput }
  | { kind: 'stick'; input: StickInput };

export interface AxisBinding {
  index: number;
  inverted: boolean;
  deadzone?: number;
}

export type AxisInput = number;

export interface AxisValueBinding {
  axis: number;
  value: number;
  marginOfError?: number;
}

export interface ButtonBinding {
  index: number;
}

export type ButtonInputBinding =
  | { kind: 'button'; binding: ButtonBinding }
  | { kind: 'axisValue'; binding: AxisValueBinding };

export interface ButtonInput {
  pressed: boolean;
}

export type Dir = 'u' | 'l' | 'd' | 'r';

export type DPadBinding = Record<Dir, ButtonInputBinding>;

export type DPadInput = Record<Dir, ButtonInput>;

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

export interface BaseComponentConfig {
  x: number;
  y: number;
  bindingId?: string;
  componentId: string;
}

export interface DPadComponentConfig {
  buttonWidth?: number;
  buttonHeight?: number;
  fill?: string;
  pressedFill?: string;
}

export interface StickComponentConfig {
  boundaryRadius?: number;
  stickRadius?: number;
  rangeScaling?: number;
  stickFill?: string;
  pressedStickFill?: string;
}

export interface ButtonComponentConfig {
  width?: number;
  height?: number;
  fill?: string;
  pressedFill?: string;
}

export type SerializedComponent = {
  baseConfig: BaseComponentConfig;
} & (
  | ({ kind: 'button'; config: ButtonComponentConfig })
  | ({ kind: 'stick'; config: StickComponentConfig })
  | ({ kind: 'dpad'; config: DPadComponentConfig }));

export type BindingId = string;

export type ComponentCallback = (c: Component) => void;

export interface BindingData {
  id?: BindingId;
  binding: Binding;
}
