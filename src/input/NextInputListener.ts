import * as T from '../types';
import { clone, uuid } from '../utils';

const newBindingId = uuid;

export type ListeningKind = 'axis' | 'button';

type ListeningState =
  | {
      kind: 'axis';
      callback: T.CB1<T.AxisBinding>;
      baselineInput?: number[];
    }
  | {
      kind: 'button';
      callback: T.CB1<T.ButtonInputBinding>;
      baselineInput?: { axes: number[]; buttons: number[] };
    };

const MIN_AXIS_MAGNITUDE = 0.5;

export class NextInputListener {
  private state?: ListeningState;
  pollingBaselineInput: boolean = false;

  awaitButton(callback: T.CB1<T.ButtonInputBinding>): void {
    this.state = { kind: 'button', callback };
    this.pollingBaselineInput = true;
  }

  awaitPositiveAxis(callback: T.CB1<T.AxisBinding>): void {
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

  update(gamepad: Gamepad): void {
    if (!this.isActive()) return;

    if (this.state.kind === 'axis') {
      if (this.pollingBaselineInput) {
        this.pollingBaselineInput = false;
        this.state.baselineInput = clone(gamepad.axes);
      } else {
        const { axes } = gamepad;

        for (let i = 0; i < axes.length; i++) {
          if (
            axes[i] !== this.state.baselineInput[i] &&
            Math.abs(axes[i]) > MIN_AXIS_MAGNITUDE
          ) {
            this.state.callback({
              id: newBindingId(),
              kind: 'axis',
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
              id: newBindingId(),
              kind: 'button',
              index: i,
            });
            return this.deactivate();
          }
        }

        for (let i = 0; i < axes.length; i++) {
          if (axes[i] !== baselineInput.axes[i]) {
            this.state.callback({
              id: newBindingId(),
              kind: 'axisValue',
              axis: i,
              value: axes[i],
            });
            return this.deactivate();
          }
        }
      }
    }
  }
}
