import { Store } from 'redux';

import { TypedComponent } from './canvas/component';

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

export type Dir = 'u' | 'l' | 'd' | 'r';

export interface DPadBinding extends BaseBinding {
  kind: 'dpad';
  u: ButtonInputBinding;
  l: ButtonInputBinding;
  d: ButtonInputBinding;
  r: ButtonInputBinding;
}

export interface DPadBindingRef extends BaseBinding {
  kind: 'dpadref';
  u: BindingId;
  l: BindingId;
  d: BindingId;
  r: BindingId;
}

export type DPadInput = Record<Dir, ButtonInput>;

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

export interface BaseComponentConfig {
  x?: number;
  y?: number;
  bindingId?: string;
  id?: string;
}

export interface DPadComponentConfig extends BaseComponentConfig {
  kind: 'dpad';
  buttonWidth?: number;
  buttonHeight?: number;
  fill?: string;
  pressedFill?: string;
}

export interface StickComponentConfig extends BaseComponentConfig {
  kind: 'stick';
  boundaryRadius?: number;
  stickRadius?: number;
  rangeScaling?: number;
  stickFill?: string;
  pressedStickFill?: string;
}

export interface ButtonComponentConfig extends BaseComponentConfig {
  kind: 'button';
  width?: number;
  height?: number;
  fill?: string;
  pressedFill?: string;
}

export type SerializedComponent =
  | ButtonComponentConfig
  | StickComponentConfig
  | DPadComponentConfig;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component = TypedComponent<any>;

export type ComponentCallback = (c: Component) => void;

export interface DisplayState {
  bindings: Binding[];
  components: SerializedComponent[];
  selectedComponent?: SerializedComponent;
}

export interface EditorState {
  display: DisplayState;
}

export type EditorAction =
  | { type: 'addBinding'; data: Binding }
  | { type: 'selectComponent'; data: string | undefined };

export type EditorStore = Store<EditorState, EditorAction>;
