import Konva from 'konva';

import Component from '../Component';
import Display from '.';
import StickDisplay from '../component/StickComponent';
import StickInput from '../map/StickMap';

interface DualStickInput {
  ls: StickInput;
  rs: StickInput;
}

export default class DualStickDisplay extends Display<DualStickInput> {
  left: StickDisplay;
  right: StickDisplay;

  constructor(stage, config) {
    super(stage);
    const { leftPos, rightPos, boundaryR, stickR } = config;

    this.left = new StickDisplay(leftPos.x, leftPos.y, boundaryR, stickR);
    this.right = new StickDisplay(rightPos.x, rightPos.y, boundaryR, stickR);

    this.componentManager.add(this.left);
    this.componentManager.add(this.right);
    console.log(this.componentManager.layer);
  }

  update(input, dt) {
    this.left.update(input.ls);
    this.right.update(input.rs);

    this.draw();
  }
}
