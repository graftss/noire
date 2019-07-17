import * as T from '../../types';

type GamepadKind = 'gamepad';

export type GamepadSourceRef = T.TypedSourceRef<GamepadKind> & {
  index: number;
};

export type GamepadSourceContainer = T.TypedSourceContainer<GamepadKind> & {
  ref: GamepadSourceRef;
  gamepad: Maybe<Gamepad>;
};

const getGamepads = (): (Maybe<Gamepad>)[] =>
  [...navigator.getGamepads()].map(g => (g === null ? undefined : g));

export const dereference = (ref: GamepadSourceRef): GamepadSourceContainer => ({
  kind: 'gamepad',
  ref,
  gamepad: getGamepads()[ref.index],
});

type BaseGamepadBinding = T.TypedBinding<GamepadKind, GamepadSourceRef>;

export type GamepadAxisBinding = BaseGamepadBinding & {
  kind: 'axis';
  inputKind: 'axis';
  index: number;
  inverted: boolean;
  deadzone?: number;
};

export type GamepadButtonBinding = BaseGamepadBinding & {
  kind: 'button';
  inputKind: 'button';
  index: number;
};

export type GamepadAxisValueBinding = BaseGamepadBinding & {
  kind: 'axisValue';
  inputKind: 'button';
  axis: number;
  value: number;
  marginOfError?: number;
};

export type GamepadBinding =
  | GamepadAxisBinding
  | GamepadButtonBinding
  | GamepadAxisValueBinding;

const DEFAULT_AXIS_VALUE_MARGIN_OF_ERROR = 0.001;
const DEFAULT_AXIS_DEADZONE = 0.005;

function parseBinding(
  b: GamepadAxisValueBinding | GamepadButtonBinding,
  s: GamepadSourceContainer,
): Maybe<T.ButtonInput>;
function parseBinding(
  b: GamepadAxisBinding,
  s: GamepadSourceContainer,
): Maybe<T.AxisInput>;
function parseBinding(
  b: GamepadBinding,
  s: GamepadSourceContainer,
): Maybe<T.Input> {
  if (!s.gamepad) return;

  switch (b.kind) {
    case 'axis': {
      const { index, inverted, deadzone = DEFAULT_AXIS_DEADZONE } = b;
      const rawValue = s.gamepad.axes[index] * (inverted ? -1 : 1);
      const input = Math.abs(rawValue) < deadzone ? 0 : rawValue;
      return { kind: 'axis', input } as T.AxisInput;
    }

    case 'button': {
      const input = s.gamepad.buttons[b.index].pressed;
      return { kind: 'button', input } as T.ButtonInput;
    }

    case 'axisValue': {
      const {
        axis,
        value,
        marginOfError = DEFAULT_AXIS_VALUE_MARGIN_OF_ERROR,
      } = b;
      const input = Math.abs(s.gamepad.axes[axis] - value) < marginOfError;
      return { kind: 'button', input } as T.ButtonInput;
    }
  }
}

const stringifyBinding = (b: Maybe<GamepadBinding>): string => {
  if (!b) return 'NONE';

  const sourceStr = `Player ${b.ref.index + 1}`;
  let bindingStr: string;

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

const exists = (s: GamepadSourceContainer): boolean => s.gamepad !== undefined;

const bindingsEqual = (b1: GamepadBinding, b2: GamepadBinding): boolean => {
  if (b1.ref.index !== b1.ref.index) return false;

  if (b1.kind === 'axis' && b2.kind === 'axis') {
    return b1.index === b2.index && b1.inverted === b2.inverted;
  } else if (b1.kind === 'axisValue' && b2.kind === 'axisValue') {
    const premargin = Math.max(b1.marginOfError || 0, b2.marginOfError || 0);
    const margin =
      premargin === 0 ? DEFAULT_AXIS_VALUE_MARGIN_OF_ERROR : premargin;
    return b1.axis === b2.axis && Math.abs(b1.value - b2.value) <= margin;
  } else if (b1.kind === 'button' && b2.kind === 'button') {
    return b1.index === b2.index;
  }

  return false;
};

export type GamepadSource = T.TypedInputSource<
  GamepadKind,
  GamepadSourceRef,
  GamepadSourceContainer,
  GamepadBinding
>;

export const gamepadSource: GamepadSource = {
  kind: 'gamepad',
  bindingsEqual,
  dereference,
  exists,
  parseBinding,
  stringifyBinding,
};
