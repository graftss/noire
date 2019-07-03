import Konva from 'konva';

import Component from '../Component';
import Display from '../display';
import { GamepadInput } from './GamepadMap';
import StickComponent from '../component/StickComponent';
import DPadComponent from '../component/DPadComponent';

export default class TestDisplay extends Display<GamepadInput> {
  left: StickComponent;
  right: StickComponent;
  dpad: DPadComponent;

  constructor(stage, config) {
    super(stage);
    const { leftPos, rightPos, boundaryR, stickR } = config;

    this.left = new StickComponent(leftPos.x, leftPos.y, boundaryR, stickR);
    this.right = new StickComponent(rightPos.x, rightPos.y, boundaryR, stickR);
    this.dpad = new DPadComponent(50, 50, 20, 20);

    this.addComponent(this.left);
    this.addComponent(this.right);
    this.addComponent(this.dpad);
  }

  update(input: GamepadInput, dt) {
    this.left.update(input.ls);
    this.right.update(input.rs);
    this.dpad.update(input.dpad);
  }
}
