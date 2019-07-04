import Konva from 'konva';

import Component from '.';
import { StickInput } from '../gamepad/inputMaps';
import { sign } from '../utils';

const depthFactor = (t: number): number => (
  t > 0.2 ?
    1 - 0.08 * Math.abs(t) :
    1 - 0.02 * Math.abs(t)
);

export default class StickComponent implements Component<StickInput> {
  group: Konva.Group;
  center: Konva.Circle;
  stick: Konva.Ellipse;
  br: number;
  sr: number;

  rangeScaling: number = 0.5;
  stickFill: string = 'black';
  pressedStickFill: string = 'darkred';

  constructor(x, y, br, sr) {
    this.group = new Konva.Group({ x, y });
    this.br = br;
    this.sr = sr;

    this.center = new Konva.Circle({
      radius: br * 0.43,
      stroke: 'black',
      strokeWidth: 2,
    });

    this.stick = new Konva.Ellipse({
      radiusX: sr,
      radiusY: sr,
      stroke: '#454545',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowBlur: 5,
      fill: this.stickFill,
    });

    this.stick.shadowEnabled(false);

    this.group.add(this.center);
    this.group.add(this.stick);
  }

  update({ x, y, down }: StickInput) {
    this.stick.position({
      x: this.br * x * this.rangeScaling,
      y: this.br * y * this.rangeScaling,
    });

    this.stick.radius({
      x: this.sr * depthFactor(x),
      y: this.sr * depthFactor(y),
    });

    this.stick.fill(down.pressed ? this.pressedStickFill : this.stickFill);

    this.stick.shadowOffset({
      x: sign(x) * depthFactor(x) * -1,
      y: sign(y) * depthFactor(y) * -1,
    });
  }
}
