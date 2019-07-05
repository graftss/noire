import Konva from 'konva';

import { Component } from '.';
import { defaults, sign } from '../utils';
import {
  BaseComponentConfig,
  StickComponentConfig,
  StickInput,
} from '../types';

export const defaultStickComponentConfig: StickComponentConfig = {
  boundaryRadius: 26,
  stickRadius: 40,
  rangeScaling: 0.5,
  stickFill: 'black',
  pressedStickFill: 'darkred',
};

const depthFactor = (t: number): number => (
  t > 0.2 ?
    1 - 0.08 * Math.abs(t) :
    1 - 0.02 * Math.abs(t)
);

export class StickComponent extends Component<StickInput> {
  center: Konva.Circle;
  stick: Konva.Ellipse;

  constructor(
    baseConfig: BaseComponentConfig,
    private config: StickComponentConfig,
  ) {
    super(baseConfig);
    this.config = defaults(defaultStickComponentConfig, config);

    const { boundaryRadius, stickRadius, stickFill } = config;

    this.center = new Konva.Circle({
      radius: boundaryRadius * 0.43,
      stroke: 'black',
      strokeWidth: 2,
    });

    this.stick = new Konva.Ellipse({
      radiusX: stickRadius,
      radiusY: stickRadius,
      stroke: '#454545',
      strokeWidth: 1,
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowBlur: 5,
      fill: stickFill,
    });

    this.stick.shadowEnabled(false);

    this.group.add(this.center);
    this.group.add(this.stick);
  }

  update({ x, y, down }: StickInput) {
    const {
      boundaryRadius,
      stickRadius,
      rangeScaling,
      stickFill,
      pressedStickFill,
    } = this.config;

    this.stick.position({
      x: boundaryRadius * x * rangeScaling,
      y: boundaryRadius * y * rangeScaling,
    });

    this.stick.radius({
      x: stickRadius * depthFactor(x),
      y: stickRadius * depthFactor(y),
    });

    this.stick.fill(down.pressed ? pressedStickFill : stickFill);

    this.stick.shadowOffset({
      x: sign(x) * depthFactor(x) * -1,
      y: sign(y) * depthFactor(y) * -1,
    });
  }
}
