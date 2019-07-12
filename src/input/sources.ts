export interface GamepadSourceRef {
  kind: 'gamepad';
  index: number;
}

export interface KeyboardSourceRef {
  kind: 'keyboard';
}

export type InputSourceRef = GamepadSourceRef | KeyboardSourceRef;

export type ButtonSourceRef = GamepadSourceRef | KeyboardSourceRef;

export type AxisSourceRef = GamepadSourceRef;

export interface GlobalSourceRefs {
  gamepads: GamepadSourceRef[];
  keyboard: KeyboardSourceRef;
}
