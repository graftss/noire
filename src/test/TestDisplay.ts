import Konva from 'konva';

import Component from '../Component';
import Display from '../display';
import StickComponent from '../component/StickComponent';
import DPadComponent from '../component/DPadComponent';
import * as M from '../gamepad/inputMaps';
import { BindingData } from '../gamepad/BindingManager';
import deserializeComponent, { SerializedComponent } from '../component/deserializeComponent';

interface GamepadBinding {
  ls: M.StickBinding;
  rs: M.StickBinding;
  dpad: M.DPadBinding;
}

const binding: GamepadBinding = {
  ls: {
    h: { index: 0, inverted: false },
    v: { index: 1, inverted: false },
    down: { index: 10 },
  },
  rs: {
    h: { index: 5, inverted: false },
    v: { index: 2, inverted: false },
    down: { index: 11 },
  },
  dpad: {
    u: { kind: 'axisValue', binding: { axis: 9, value: -1 } },
    l: { kind: 'axisValue', binding: { axis: 9, value: 0.7142857 } },
    d: { kind: 'axisValue', binding: { axis: 9, value: 0.1428571 } },
    r: { kind: 'axisValue', binding: { axis: 9, value: -0.428571 } },
  }
};

const ids = ['a', 'b', 'c']

const bindingList: BindingData[] = [
  { id: ids[0], binding: { kind: 'stick', binding: binding.ls } },
  { id: ids[1], binding: { kind: 'stick', binding: binding.rs } },
  { id: ids[2], binding: { kind: 'dpad', binding: binding.dpad } },
];

const stickConfig = {
  boundaryRadius: 40,
  stickRadius: 26,
};

const leftBaseConfig = { x: 200, y: 200 };

const rightBaseConfig = { x: 310, y: 200 };

const dPadBaseConfig = { x: 50, y: 50 };

const dPadConfig = {
  buttonWidth: 30,
  buttonHeight: 30,
};

const serializedComponents: SerializedComponent[] = [
  { kind: 'stick', baseConfig: leftBaseConfig, config: stickConfig },
  { kind: 'stick', baseConfig: rightBaseConfig, config: stickConfig },
  { kind: 'dpad', baseConfig: dPadBaseConfig, config: dPadConfig },
];

export default class TestDisplay extends Display {
  constructor(stage, layer) {
    super(stage, layer, bindingList);

    const components = serializedComponents.map(deserializeComponent);

    components.forEach((c, i) => this.addComponent(c, ids[i]));
  }
}
