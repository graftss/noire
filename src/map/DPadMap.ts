import ButtonMap, { ButtonBinding, ButtonInput } from './ButtonMap';
import AxisValueMap, { AxisValueBinding } from './AxisValueMap';

export interface DPadDict<T> {
  u: T;
  l: T;
  d: T;
  r: T;
}

export type DPadBinding = {
  kind: 'axis';
  binding: DPadDict<AxisValueBinding>;
} | {
  kind: 'button';
  binding: DPadDict<ButtonBinding>;
}

export type DPadInput = DPadDict<ButtonInput>

export default class DPadMap {
  binding: DPadBinding;
  map: DPadDict<AxisValueMap | ButtonMap>;

  constructor(binding: DPadBinding) {
    this.binding = binding;

    if (binding.kind === 'axis') {
      this.map = {
        u: new AxisValueMap(binding.binding.u),
        l: new AxisValueMap(binding.binding.l),
        d: new AxisValueMap(binding.binding.d),
        r: new AxisValueMap(binding.binding.r),
      };
    } else {
      this.map = {
        u: new ButtonMap(binding.binding.u),
        l: new ButtonMap(binding.binding.l),
        d: new ButtonMap(binding.binding.d),
        r: new ButtonMap(binding.binding.r),
      };
    }
  }

  getInput(gamepad: Gamepad): DPadInput {
    return {
      u: this.map.u.getInput(gamepad),
      l: this.map.l.getInput(gamepad),
      d: this.map.d.getInput(gamepad),
      r: this.map.r.getInput(gamepad),
    }
  }
}
