import Konva from 'konva';

import Component from '../Component';
import Display from '../display';
import { GamepadInput, GamepadBinding } from './GamepadMap';
import StickComponent from '../component/StickComponent';
import DPadComponent from '../component/DPadComponent';
import * as M from '../gamepad/inputMaps';
import { BindingData } from '../gamepad/BindingManager';

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

const bindingList: BindingData[] = [
  { id: 0, binding: { kind: 'stick', binding: binding.ls } },
  { id: 1, binding: { kind: 'stick', binding: binding.rs } },
  { id: 2, binding: { kind: 'dpad', binding: binding.dpad } },
];

const analogConfig = {
  leftPos: { x: 200, y: 200 },
  rightPos: { x: 310, y: 200 },
  boundaryR: 40,
  stickR: 26,
};

export default class TestDisplay extends Display {
  left: StickComponent;
  right: StickComponent;
  dpad: DPadComponent;

  constructor(stage, layer) {
    super(stage, layer, bindingList);
    const { leftPos, rightPos, boundaryR, stickR } = analogConfig;

    this.left = new StickComponent(leftPos.x, leftPos.y, boundaryR, stickR);
    this.right = new StickComponent(rightPos.x, rightPos.y, boundaryR, stickR);
    this.dpad = new DPadComponent(50, 50, 20, 20);

    this.addComponent(this.left, 0);
    this.addComponent(this.right, 1);
    this.addComponent(this.dpad, 2);
  }
}
