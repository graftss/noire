import { ButtonBinding, AxisValueBinding, AxisBinding } from './inputmaps';
import { clone } from '../utils';

export type ButtonInputBinding = {
  kind: 'button';
  binding: ButtonBinding;
} | {
  kind: 'axisValue';
  binding: AxisValueBinding;
};

type ListeningState = {
  kind: 'axis';
  callback: (binding: AxisBinding) => any;
  baselineInput?: number[];
} | {
  kind: 'button';
  callback: (binding: ButtonInputBinding) => any;
  baselineInput?: { axes: number[], buttons: number[] };
};

const MIN_AXIS_MAGNITUDE = 0.5;

export default class NextInputListener {
  state?: ListeningState;
  active: boolean = false;

  awaitButton(callback) {
    this.state = { kind: 'button', callback };
    this.active = true;
  }

  awaitPositiveAxis(callback) {
    this.state = { kind: 'axis', callback };
    this.active = true;
  }

  deactivate() {
    this.active = false;
    this.state = undefined;
  }

  update(gamepad: Gamepad) {
    if (!this.state) return;

    const { callback } = this.state;

    if (this.state.kind === 'axis') {
      if (this.active) {
        this.active = false;
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
      if (this.active) {
        this.active = false;
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
