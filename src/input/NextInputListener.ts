import * as T from '../types';
import { clone } from '../utils';

export type AwaitAxisCallback = T.CB2<T.AxisSource, T.AxisBinding>;
export type AwaitButtonCallback = T.CB2<T.ButtonSource, T.ButtonInputBinding>;

type AwaitAxisInput = number[];

interface AwaitButtonInput {
  axes: number[];
  buttons: number[];
}

type ListeningState =
  | {
      kind: 'axis';
      callback: AwaitAxisCallback;
      baselineInput?: (AwaitAxisInput | null)[];
    }
  | {
      kind: 'button';
      callback: AwaitButtonCallback;
      baselineInput?: (AwaitButtonInput | null)[];
    };

const MIN_AXIS_MAGNITUDE = 0.5;

const getAwaitAxisInput = (g: Gamepad | null): AwaitAxisInput | null =>
  g && clone(g.axes);

const compareAwaitAxisInput = (
  axes: AwaitAxisInput,
  baseline: AwaitAxisInput,
  gamepadIndex: number,
): Maybe<T.AxisBinding> => {
  if (!axes) return;
  const source: T.GamepadSource = { kind: 'gamepad', index: gamepadIndex };

  for (let index = 0; index < axes.length; index++) {
    const axis = axes[index];
    if (axis !== baseline[index] && Math.abs(axis) > MIN_AXIS_MAGNITUDE) {
      return { kind: 'axis', source, index, inverted: axis < 0 };
    }
  }
};

const getAwaitButtonInput = (g: Gamepad | null): AwaitButtonInput | null =>
  g &&
  clone({
    buttons: g.buttons.map(b => b.value),
    axes: g.axes,
  });

// TODO: force axisValue bindings to be held for multiple frames?
// something to distinguish them from axis input
const compareAwaitButtonInput = (
  input: AwaitButtonInput,
  baseline: AwaitButtonInput,
  gamepadIndex: number,
): Maybe<T.ButtonInputBinding> => {
  if (!input) return;
  const source: T.GamepadSource = { kind: 'gamepad', index: gamepadIndex };

  const { axes, buttons } = input;

  for (let index = 0; index < buttons.length; index++) {
    if (buttons[index] !== baseline.buttons[index]) {
      return {
        kind: 'button',
        source: { kind: 'gamepad', index: gamepadIndex },
        index,
      };
    }
  }

  for (let axis = 0; axis < axes.length; axis++) {
    const value = axes[axis];
    if (value !== baseline.axes[axis]) {
      return { kind: 'axisValue', source, axis, value };
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

  update(gamepads: (Gamepad | null)[]): void {
    if (this.state === undefined) return;

    if (this.pollingBaselineInput) {
      switch (this.state.kind) {
        case 'axis':
          this.state.baselineInput = gamepads.map(getAwaitAxisInput);
          break;
        case 'button':
          this.state.baselineInput = gamepads.map(getAwaitButtonInput);
          break;
      }

      this.pollingBaselineInput = false;
    } else {
      switch (this.state.kind) {
        case 'axis': {
          const allInput = gamepads.map(getAwaitAxisInput);

          for (let index = 0; index < gamepads.length; index++) {
            const input = allInput[index];
            if (!input || !this.state.baselineInput) continue;

            const awaitedBinding = compareAwaitAxisInput(
              input,
              this.state.baselineInput[index] as AwaitAxisInput,
              index,
            );
            if (awaitedBinding) {
              const source: T.GamepadSource = { kind: 'gamepad', index };
              this.state.callback(source, awaitedBinding);
              return this.deactivate();
            }
          }

          break;
        }

        case 'button': {
          const allInput = gamepads.map(getAwaitButtonInput);

          for (let index = 0; index < gamepads.length; index++) {
            const input = allInput[index];
            if (!input || !this.state.baselineInput) continue;

            const awaitedBinding = compareAwaitButtonInput(
              input[index],
              this.state.baselineInput[index] as AwaitButtonInput,
              index,
            );
            if (awaitedBinding) {
              const source: T.GamepadSource = { kind: 'gamepad', index };
              this.state.callback(source, awaitedBinding);
              return this.deactivate();
            }
          }
        }
      }
    }
  }
}
