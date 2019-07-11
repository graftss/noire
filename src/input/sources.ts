export interface GamepadSource {
  kind: 'gamepad';
  index: number;
  id?: string;
}

export interface KeyboardSource {
  kind: 'keyboard';
  id?: string;
}

export type InputSource = GamepadSource | KeyboardSource;

export type ButtonSource = GamepadSource | KeyboardSource;

export type AxisSource = GamepadSource;

export interface GlobalSources {
  gamepads: GamepadSource[];
  keyboard: KeyboardSource;
}
