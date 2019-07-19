import * as T from '../../types';
import { cloneArray } from '../../utils';

type GamepadKind = 'gamepad';

export type GamepadSourceRef = T.TypedSourceRef<GamepadKind> & {
  index: number;
};

export type GamepadSourceContainer = T.TypedSourceContainer<GamepadKind> & {
  ref: GamepadSourceRef;
  gamepad: Maybe<Gamepad>;
};

type BaseGamepadBinding = T.TypedBinding<GamepadKind, GamepadSourceRef>;

export interface GamepadInputSnapshot extends Record<T.InputKind, object> {
  axis: number[];
  button: { buttons: boolean[]; axisValues: number[] };
}

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

export type GamepadSource = T.TypedInputSource<
  GamepadKind,
  GamepadSourceRef,
  GamepadSourceContainer,
  GamepadBinding,
  GamepadInputSnapshot
>;

export type GamepadSourceFactory = T.TypedInputSourceFactory<
  GamepadKind,
  GamepadSourceRef,
  GamepadSourceContainer,
  GamepadBinding,
  GamepadInputSnapshot,
  Maybe<Gamepad>[]
>;

export const getGamepads = (): (Maybe<Gamepad>)[] =>
  [...navigator.getGamepads()].map(g => (g === null ? undefined : g));

const DEFAULT_AXIS_VALUE_MARGIN_OF_ERROR = 0.001;
const DEFAULT_AXIS_DEADZONE = 0.005;
const MIN_AXIS_MAGNITUDE = 0.5;
const MIN_AXIS_DIFFERENCE = 0.1;

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

const areBindingsEqual = (b1: GamepadBinding, b2: GamepadBinding): boolean => {
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

export const gamepadBindingAPI: T.InputSourceBindingAPI<
  GamepadKind,
  GamepadSourceRef,
  GamepadBinding
> = {
  stringifyBinding,
  areBindingsEqual,
};

export const gamepadSourceFactory: GamepadSourceFactory = (
  getGamepads: () => Maybe<Gamepad>[],
) => {
  const dereference = (ref: GamepadSourceRef): GamepadSourceContainer => ({
    kind: 'gamepad',
    ref,
    gamepad: getGamepads()[ref.index],
  });

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

  const exists = (s: GamepadSourceContainer): boolean =>
    s.gamepad !== undefined;

  // TODO: how do I get typescript to infer what K is based on the value
  // of `kind`?
  const snapshotInput = <K extends T.InputKind>(
    ref: GamepadSourceRef,
    kind: K,
  ): Maybe<GamepadInputSnapshot[K]> => {
    const gamepad = dereference(ref).gamepad;
    if (!gamepad) return;

    switch (kind) {
      case 'button':
        return {
          buttons: gamepad.buttons.map(b => b.pressed),
          axisValues: cloneArray(gamepad.axes),
        } as GamepadInputSnapshot[K];

      case 'axis':
        return cloneArray(gamepad.axes) as GamepadInputSnapshot[K];
    }
  };

  const snapshotBindingDiff = <IK extends T.InputKind>(
    ref: GamepadSourceRef,
    kind: IK,
    input: GamepadInputSnapshot[IK],
    baseline: GamepadInputSnapshot[IK],
  ): Maybe<T.BindingOfInputType<IK>> => {
    switch (kind) {
      case 'axis': {
        const a1 = input as GamepadInputSnapshot['axis'];
        const a2 = baseline as GamepadInputSnapshot['axis'];

        for (let index = 0; index < a1.length; index++) {
          if (a1[index] === undefined) continue;

          if (
            Math.abs(a1[index] - a2[index]) > MIN_AXIS_DIFFERENCE &&
            Math.abs(a1[index]) > MIN_AXIS_MAGNITUDE
          ) {
            const result: GamepadAxisBinding = {
              kind: 'axis',
              inputKind: 'axis',
              sourceKind: 'gamepad',
              ref,
              index,
              inverted: a1[index] < 0,
            };

            return result as T.BindingOfInputType<IK>;
          }
        }

        break;
      }

      case 'button': {
        const a1 = input as GamepadInputSnapshot['button'];
        const a2 = baseline as GamepadInputSnapshot['button'];

        for (let axisIndex = 0; axisIndex < a1.axisValues.length; axisIndex++) {
          const axis1 = a1.axisValues[axisIndex];

          if (axis1 !== a2.axisValues[axisIndex]) {
            const result: GamepadAxisValueBinding = {
              kind: 'axisValue',
              inputKind: 'button',
              sourceKind: 'gamepad',
              ref,
              axis: axisIndex,
              value: axis1,
            };

            return result as T.BindingOfInputType<IK>;
          }
        }

        for (
          let buttonIndex = 0;
          buttonIndex < a1.buttons.length;
          buttonIndex++
        ) {
          if (a1.buttons[buttonIndex] !== a2.buttons[buttonIndex]) {
            const result: GamepadButtonBinding = {
              kind: 'button',
              inputKind: 'button',
              sourceKind: 'gamepad',
              ref,
              index: buttonIndex,
            };

            return result as T.BindingOfInputType<IK>;
          }
        }
      }
    }
  };

  return {
    kind: 'gamepad',
    dereference,
    exists,
    parseBinding,
    snapshotInput,
    snapshotBindingDiff,
  };
};
