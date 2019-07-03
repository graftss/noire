import { ButtonBinding } from '../map/ButtonMap';
import { AxisValueBinding } from '../map/AxisValueMap';
import { clone } from '../utils';

type ButtonDescriptor = {
  kind: 'button';
  binding: ButtonBinding;
} | {
  kind: 'axisValue';
  binding: AxisValueBinding;
};

type state = {
  kind: 'axis';
  callback: (axis: number) => any;
  baselineInput?: number[];
} | {
  kind: 'button';
  callback: (button: ButtonDescriptor) => any;
  baselineInput?: { axes: number[], buttons: number[] };
};

const MIN_AXIS_MAGNITUDE = 0.5;

export default class NextInputListener {
  state?: state;
  active: boolean = false;

  onNextButton(callback) {
    this.state = { kind: 'button', callback };
    this.active = true;
  }

  onNextAxis(callback: (axis: number) => any) {
    this.state = { kind: 'axis', callback };
    this.active = true;
    console.log('starting');
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
            this.state.callback(i);
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
              binding: { downIndex: i },
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
