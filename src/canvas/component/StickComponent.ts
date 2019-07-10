import Konva from 'konva';

import * as T from '../../types';
import { TypedComponent } from './Component';
import { sign } from '../../utils';

export interface StickConfig {
  kind: 'stick';
  boundaryRadius?: number;
  stickRadius?: number;
  rangeScaling?: number;
  stickFill?: string;
  pressedStickFill?: string;
}

export const defaultStickComponentConfig: StickConfig = {
  kind: 'stick',
  boundaryRadius: 26,
  stickRadius: 40,
  rangeScaling: 0.5,
  stickFill: 'black',
  pressedStickFill: 'darkred',
};

const defaultInput: T.StickInput = {
  x: 0,
  y: 0,
  button: { pressed: false },
};

export type StickComponentConfig = StickConfig &
  T.BaseComponentConfig<T.StickInput>;

const depthFactor = (t: number): number =>
  t > 0.2 ? 1 - 0.08 * Math.abs(t) : 1 - 0.02 * Math.abs(t);

export class StickComponent extends TypedComponent<T.StickInput> {
  protected config: StickComponentConfig;
  private center: Konva.Circle;
  private stick: Konva.Ellipse;

  constructor(config: StickComponentConfig) {
    super(
      TypedComponent.generateConfig(
        config,
        defaultStickComponentConfig,
        defaultInput,
      ),
    );

    const { boundaryRadius, stickRadius, stickFill } = this.config;

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

  update(input: T.StickInput): void {
    const { x, y, button } = this.applyDefaultInput(input);

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

    this.stick.fill(button.pressed ? pressedStickFill : stickFill);

    this.stick.shadowOffset({
      x: sign(x) * depthFactor(x) * -1,
      y: sign(y) * depthFactor(y) * -1,
    });
  }
}
