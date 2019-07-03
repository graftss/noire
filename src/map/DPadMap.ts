import ButtonMap, { ButtonBindings, ButtonInput } from './ButtonMap';
import AxisValueMap, { AxisValueBindings } from './AxisValueMap';

export interface DPadDict<T> {
  u: T;
  l: T;
  d: T;
  r: T;
}

export type DPadBindings = {
  kind: 'axis';
  bindings: DPadDict<AxisValueBindings>;
} | {
  kind: 'button';
  bindings: DPadDict<ButtonBindings>;
}

export type DPadInput = DPadDict<ButtonInput>

export default class DPadMap {
  bindings: DPadBindings;
  map: DPadDict<AxisValueMap | ButtonMap>;

  constructor(bindings: DPadBindings) {
    this.bindings = bindings;

    if (bindings.kind === 'axis') {
      this.map = {
        u: new AxisValueMap(bindings.bindings.u),
        l: new AxisValueMap(bindings.bindings.l),
        d: new AxisValueMap(bindings.bindings.d),
        r: new AxisValueMap(bindings.bindings.r),
      };
    } else {
      this.map = {
        u: new ButtonMap(bindings.bindings.u),
        l: new ButtonMap(bindings.bindings.l),
        d: new ButtonMap(bindings.bindings.d),
        r: new ButtonMap(bindings.bindings.r),
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
