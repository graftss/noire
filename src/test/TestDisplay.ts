import Konva from 'konva';

import Component from '../Component';
import Display from '../display';
import { GamepadInput } from './GamepadMap';
import StickComponent from '../component/StickComponent';
import ButtonComponent from '../component/ButtonComponent';

export default class TestDisplay extends Display<GamepadInput> {
  left: StickComponent;
  right: StickComponent;
  up: ButtonComponent;

  constructor(stage, config) {
    super(stage);
    const { leftPos, rightPos, boundaryR, stickR } = config;

    this.left = new StickComponent(leftPos.x, leftPos.y, boundaryR, stickR);
    this.right = new StickComponent(rightPos.x, rightPos.y, boundaryR, stickR);
    this.up = new ButtonComponent(400, 100);

    this.componentManager.add(this.left);
    this.componentManager.add(this.right);
    this.componentManager.add(this.up);
  }

  update(input, dt) {
    this.left.update(input.ls);
    this.right.update(input.rs);
    this.up.update(input.dpad.u);

    this.draw();
  }
}
