export interface GamepadSourceRef {
  kind: 'gamepad';
  index: number;
}

// apparently you have to reiterate the kind, even though it's stored
// on the ref, because typescript can't infer types from nested
// literals
export interface GamepadSource {
  kind: 'gamepad';
  ref: GamepadSourceRef;
  gamepad: Gamepad | null;
}

export interface KeyboardSourceRef {
  kind: 'keyboard';
}

export interface KeyboardSource {
  kind: 'keyboard';
  ref: KeyboardSourceRef;
  keyboard: object;
}

export type InputSourceRef = GamepadSourceRef | KeyboardSourceRef;

export type InputSource = GamepadSource | KeyboardSource;

export type ButtonSourceRef = GamepadSourceRef | KeyboardSourceRef;

export type ButtonSource = GamepadSource | KeyboardSource;

export type AxisSourceRef = GamepadSourceRef;

export type AxisSource = GamepadSource;

export interface GlobalSourceRefs {
  gamepads: GamepadSourceRef[];
  keyboard: KeyboardSourceRef;
}

// TODO: I'm not sure if this is the best place for this
const getGamepads = (): (Gamepad | null)[] => [...navigator.getGamepads()];

export function dereferenceSource(ref: GamepadSourceRef): GamepadSource;
export function dereferenceSource(ref: KeyboardSourceRef): KeyboardSource;
export function dereferenceSource(ref: InputSourceRef): InputSource;
export function dereferenceSource(ref: InputSourceRef): InputSource {
  switch (ref.kind) {
    case 'gamepad':
      return { kind: 'gamepad', ref, gamepad: getGamepads()[ref.index] };
    case 'keyboard':
      return { kind: 'keyboard', ref, keyboard: {} };
  }
}

export const isSourceNull = (source: InputSource): boolean => {
  switch (source.kind) {
    case 'gamepad':
      return source.gamepad === null;
    case 'keyboard':
      return true;
  }
};
