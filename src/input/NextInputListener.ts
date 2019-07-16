import * as T from '../types';
import { clone } from '../utils';
import { dereference } from './source';

export type AwaitAxisCallback = CB1<T.BindingOfInputType<'axis'>>;
export type AwaitButtonCallback = CB1<T.BindingOfInputType<'button'>>;

// TODO: move input collection/comparisons and their relevant types to
// the individual source definition files

interface AwaitAxisInput {
  gamepads: Maybe<number[]>[];
}

interface AwaitButtonInput {
  gamepads: Maybe<{ axes: number[]; buttons: number[] }>[];
}

type ListeningState =
  | {
      kind: 'axis';
      callback: AwaitAxisCallback;
      baselineInput?: Maybe<AwaitAxisInput>;
    }
  | {
      kind: 'button';
      callback: AwaitButtonCallback;
      baselineInput?: Maybe<AwaitButtonInput>;
    };

const getAwaitAxisInput = (s: T.GlobalSourceRefs): AwaitAxisInput => {
  const result: AwaitAxisInput = { gamepads: [] };
  const { gamepads } = s;

  for (let i = 0; i < s.gamepads.length; i++) {
    const gamepad = dereference(gamepads[i]).gamepad;
    if (gamepad) result.gamepads[i] = clone(gamepad.axes);
  }

  return result;
};

const MIN_AXIS_MAGNITUDE = 0.5;
const MIN_AXIS_DIFFERENCE = 0.1;

const compareAwaitAxisInput = (
  input: AwaitAxisInput,
  baseline: AwaitAxisInput,
  refs: T.GlobalSourceRefs,
): Maybe<T.BindingOfInputType<'axis'>> => {
  for (let index = 0; index < input.gamepads.length; index++) {
    const gamepadInput = input.gamepads[index];
    const baselineGamepadInput = baseline.gamepads[index];
    if (!gamepadInput || !baselineGamepadInput) continue;
    for (let axisIndex = 0; axisIndex < gamepadInput.length; axisIndex++) {
      const gamepadAxis = gamepadInput[axisIndex];

      if (
        Math.abs(gamepadAxis - baselineGamepadInput[axisIndex]) >
          MIN_AXIS_DIFFERENCE &&
        Math.abs(gamepadAxis) > MIN_AXIS_MAGNITUDE
      ) {
        return {
          kind: 'axis',
          inputKind: 'axis',
          sourceKind: 'gamepad',
          ref: refs.gamepads[index],
          index: axisIndex,
          inverted: gamepadAxis < 0,
        };
      }
    }
  }
};

const getAwaitButtonInput = (s: T.GlobalSourceRefs): AwaitButtonInput => {
  const result: AwaitButtonInput = { gamepads: [] };
  const { gamepads } = s;

  for (let i = 0; i < s.gamepads.length; i++) {
    const gamepad = dereference(gamepads[i]).gamepad;
    if (gamepad) {
      result.gamepads[i] = {
        axes: clone(gamepad.axes),
        buttons: clone(gamepad.buttons),
      };
    }
  }

  return result;
};

// TODO: force axisValue bindings to be held for multiple frames?
// something to distinguish them from axis input
const compareAwaitButtonInput = (
  input: AwaitButtonInput,
  baseline: AwaitButtonInput,
  refs: T.GlobalSourceRefs,
): Maybe<T.BindingOfInputType<'button'>> => {
  for (let index = 0; index < input.gamepads.length; index++) {
    const gamepadInput = input.gamepads[index];
    const baselineGamepadInput = baseline.gamepads[index];
    const ref = refs.gamepads[index];

    if (!gamepadInput || !baselineGamepadInput) continue;

    for (let axisIndex = 0; axisIndex < gamepadInput.axes.length; axisIndex++) {
      const gamepadAxis = gamepadInput.axes[axisIndex];
      if (gamepadAxis !== baselineGamepadInput.axes[axisIndex]) {
        return {
          kind: 'axisValue',
          inputKind: 'button',
          sourceKind: 'gamepad',
          ref,
          axis: axisIndex,
          value: gamepadAxis,
        };
      }
    }

    for (
      let buttonIndex = 0;
      buttonIndex < gamepadInput.buttons.length;
      buttonIndex++
    ) {
      const gamepadButton = gamepadInput.buttons[buttonIndex];
      if (gamepadButton !== baselineGamepadInput.buttons[buttonIndex]) {
        return {
          kind: 'button',
          inputKind: 'button',
          sourceKind: 'gamepad',
          ref,
          index,
        };
      }
    }
  }
};

export class NextInputListener {
  private state?: ListeningState;
  private pollingBaselineInput: boolean = false;

  awaitButton(callback: AwaitButtonCallback): void {
    this.state = { kind: 'button', callback };
    this.pollingBaselineInput = true;
  }

  awaitPositiveAxis(callback: AwaitAxisCallback): void {
    this.state = { kind: 'axis', callback };
    this.pollingBaselineInput = true;
  }

  isActive(): boolean {
    return this.state !== undefined;
  }

  deactivate(): void {
    this.pollingBaselineInput = false;
    this.state = undefined;
  }

  update(refs: T.GlobalSourceRefs): void {
    if (this.state === undefined) return;
    const state: ListeningState = this.state;

    if (this.pollingBaselineInput) {
      this.pollingBaselineInput = false;
      switch (state.kind) {
        case 'axis':
          state.baselineInput = getAwaitAxisInput(refs);
          break;
        case 'button':
          state.baselineInput = getAwaitButtonInput(refs);
          break;
      }
    } else {
      switch (state.kind) {
        case 'axis': {
          const awaitedBinding = compareAwaitAxisInput(
            getAwaitAxisInput(refs),
            state.baselineInput as AwaitAxisInput,
            refs,
          );

          if (awaitedBinding) {
            state.callback(awaitedBinding);
            this.deactivate();
          }

          break;
        }

        case 'button': {
          const awaitedBinding = compareAwaitButtonInput(
            getAwaitButtonInput(refs),
            state.baselineInput as AwaitButtonInput,
            refs,
          );

          if (awaitedBinding) {
            state.callback(awaitedBinding);
            this.deactivate();
          }

          break;
        }
      }
    }
  }
}
