import * as T from '../types';
import { clone } from '../utils';
import { dereferenceSource } from './sources';

export type AwaitAxisCallback = T.CB1<T.AxisBinding>;
export type AwaitButtonCallback = T.CB1<T.ButtonInputBinding>;

type AwaitAxisInput = number[];

interface AwaitButtonInput {
  axes: number[];
  buttons: number[];
}

type ListeningState =
  | {
      kind: 'axis';
      callback: AwaitAxisCallback;
      baselineInput?: Maybe<AwaitAxisInput>[];
    }
  | {
      kind: 'button';
      callback: AwaitButtonCallback;
      baselineInput?: Maybe<AwaitButtonInput>[];
    };

const MIN_AXIS_MAGNITUDE = 0.5;

const getAwaitAxisInput = (s: T.InputSource): Maybe<AwaitAxisInput> => {
  switch (s.kind) {
    case 'gamepad':
      return s.gamepad ? clone(s.gamepad.axes) : undefined;
  }
};

const compareAwaitAxisInput = (
  axes: AwaitAxisInput,
  baseline: AwaitAxisInput,
  sourceRef: T.InputSourceRef,
): Maybe<T.AxisBinding> => {
  for (let index = 0; index < axes.length; index++) {
    const axis = axes[index];
    if (axis !== baseline[index] && Math.abs(axis) > MIN_AXIS_MAGNITUDE) {
      return { kind: 'axis', sourceRef, index, inverted: axis < 0 };
    }
  }
};

const getAwaitButtonInput = (s: T.InputSource): Maybe<AwaitButtonInput> => {
  switch (s.kind) {
    case 'gamepad': {
      return s.gamepad
        ? {
            axes: clone(s.gamepad.axes),
            buttons: clone(s.gamepad.buttons.map(b => b.value)),
          }
        : undefined;
    }
  }
};

// TODO: force axisValue bindings to be held for multiple frames?
// something to distinguish them from axis input
const compareAwaitButtonInput = (
  input: AwaitButtonInput,
  baseline: AwaitButtonInput,
  sourceRef: T.InputSourceRef,
): Maybe<T.ButtonInputBinding> => {
  const { axes, buttons } = input;

  for (let index = 0; index < buttons.length; index++) {
    if (buttons[index] !== baseline.buttons[index]) {
      return { kind: 'button', sourceRef, index };
    }
  }

  for (let axis = 0; axis < axes.length; axis++) {
    const value = axes[axis];
    if (value !== baseline.axes[axis]) {
      return { kind: 'axisValue', sourceRef, axis, value };
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

  update(sourceRefs: T.InputSourceRef[]): void {
    if (this.state === undefined) return;
    const state: ListeningState = this.state;
    const sources: T.InputSource[] = sourceRefs.map(dereferenceSource);

    if (this.pollingBaselineInput) {
      this.pollingBaselineInput = false;
      switch (state.kind) {
        case 'axis':
          state.baselineInput = sources.map(getAwaitAxisInput);
          break;
        case 'button':
          state.baselineInput = sources.map(getAwaitButtonInput);
          break;
      }
    } else {
      switch (state.kind) {
        case 'axis': {
          const allInput = sources.map(getAwaitAxisInput);

          for (let index = 0; index < sources.length; index++) {
            const input = allInput[index];
            const baseline = state.baselineInput && state.baselineInput[index];

            if (!input || !baseline) continue;

            const ref = sourceRefs[index];
            const awaitedBinding = compareAwaitAxisInput(input, baseline, ref);
            if (awaitedBinding) {
              state.callback(awaitedBinding);
              return this.deactivate();
            }
          }

          break;
        }

        case 'button': {
          const allInput = sources.map(getAwaitButtonInput);

          for (let index = 0; index < sources.length; index++) {
            const input = allInput[index];
            const baseline = state.baselineInput && state.baselineInput[index];
            const ref = sourceRefs[index];

            if (!input || !baseline) continue;

            const awaitedBinding = compareAwaitButtonInput(
              input,
              baseline,
              ref,
            );

            if (awaitedBinding) {
              state.callback(awaitedBinding);
              return this.deactivate();
            }
          }

          break;
        }
      }
    }
  }
}
