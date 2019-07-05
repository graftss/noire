import * as T from '../types';
import { clone } from '../utils';

type AxisCallback = (binding: T.AxisBinding) => any;
type ButtonCallback = (binding: T.ButtonInputBinding) => any;

type ListeningState = {
  kind: 'axis';
  callback: AxisCallback;
  baselineInput?: number[];
} | {
  kind: 'button';
  callback: ButtonCallback;
  baselineInput?: { axes: number[], buttons: number[] };
};

const MIN_AXIS_MAGNITUDE = 0.5;

export class NextInputListener {
  private state?: ListeningState;
  pollingBaselineInput: boolean = false;

  awaitButton(callback: ButtonCallback) {
    this.state = { kind: 'button', callback };
    this.pollingBaselineInput = true;
  }

  awaitPositiveAxis(callback: AxisCallback) {
    this.state = { kind: 'axis', callback };
    this.pollingBaselineInput = true;
  }

  isActive(): boolean {
    return this.state !== undefined;
  }

  deactivate() {
    this.pollingBaselineInput = false;
    this.state = undefined;
  }

  update(gamepad: Gamepad) {
    if (!this.isActive()) return;

    // TODO: put `baselineInput` here
    const { callback } = this.state;

    if (this.state.kind === 'axis') {
      if (this.pollingBaselineInput) {
        this.pollingBaselineInput = false;
        this.state.baselineInput = clone(gamepad.axes);
      } else {
        const { axes } = gamepad;

        for (let i = 0; i < axes.length; i++) {
          if (axes[i] !== this.state.baselineInput[i] &&
              Math.abs(axes[i]) > MIN_AXIS_MAGNITUDE) {
            this.state.callback({
              index: i,
              inverted: axes[i] < 0,
            });
            return this.deactivate();
          }
        }
      }
    } else if (this.state.kind === 'button') {
      if (this.pollingBaselineInput) {
        this.pollingBaselineInput = false;
        this.state.baselineInput = clone({
          buttons: gamepad.buttons.map(b => b.value),
          axes: gamepad.axes,
        });
      } else {
        const { buttons, axes } = gamepad;
        const { baselineInput } = this.state;

        for (let i = 0; i < buttons.length; i++) {
          if (buttons[i].value !== baselineInput.buttons[i]) {
            this.state.callback({
              kind: 'button',
              binding: { index: i },
            });
            return this.deactivate();
          }
        }

        for (let i = 0; i < axes.length; i++) {
          if (axes[i] !== baselineInput.axes[i]) {
            this.state.callback({
              kind: 'axisValue',
              binding: { axis: i, value: axes[i] },
            });
            return this.deactivate();
          }
        }
      }
    }
  }
}
