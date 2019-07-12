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
      baselineInput?: AwaitAxisInput[];
    }
  | {
      kind: 'button';
      callback: AwaitButtonCallback;
      baselineInput?: AwaitButtonInput[];
    };

const MIN_AXIS_MAGNITUDE = 0.5;

const getAwaitAxisInput = (g: Gamepad): AwaitAxisInput | null =>
  g && clone(g.axes);

const compareAwaitAxisInput = (
  axes: AwaitAxisInput,
  baseline: AwaitAxisInput,
  gamepadIndex: number,
): T.AxisBinding | undefined => {
  if (!axes) return;
  const source: T.GamepadSource = { kind: 'gamepad', index: gamepadIndex };

  for (let index = 0; index < axes.length; index++) {
    const axis = axes[index];
    if (axis !== baseline[index] && Math.abs(axis) > MIN_AXIS_MAGNITUDE) {
      return { kind: 'axis', source, index, inverted: axis < 0 };
    }
  }
};

const getAwaitButtonInput = (g: Gamepad): AwaitButtonInput | null =>
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
): T.ButtonInputBinding | undefined => {
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

  update(gamepads: Gamepad[]): void {
    if (!this.isActive()) return;

    console.log('hello');

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
          const input = gamepads.map(getAwaitAxisInput);

          for (let index = 0; index < gamepads.length; index++) {
            const awaitedBinding = compareAwaitAxisInput(
              input[index],
              this.state.baselineInput[index],
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
          const input = gamepads.map(getAwaitButtonInput);

          for (let index = 0; index < gamepads.length; index++) {
            const awaitedBinding = compareAwaitButtonInput(
              input[index],
              this.state.baselineInput[index],
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
