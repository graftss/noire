export interface GamepadSource {
  kind: 'gamepad';
  index: number;
  id: string;
}

export interface KeyboardSource {
  kind: 'keyboard';
  id: string;
}

export type InputSource = GamepadSource | KeyboardSource;
