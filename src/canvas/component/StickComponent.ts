import Konva from 'konva';
import * as T from '../../types';
import { sign } from '../../utils';
import { TypedComponent } from './Component';

export interface StickConfig {
  kind: 'stick';
  inputKinds: { x: 'axis'; y: 'axis'; button: 'button' };
  boundaryRadius?: number;
  stickRadius?: number;
  rangeScaling?: number;
  stickFill?: string;
  pressedStickFill?: string;
}

export const defaultStickComponentConfig: Required<StickConfig> = {
  kind: 'stick',
  inputKinds: { x: 'axis', y: 'axis', button: 'button' },
  boundaryRadius: 26,
  stickRadius: 40,
  rangeScaling: 0.5,
  stickFill: 'black',
  pressedStickFill: 'darkred',
};

export const stickEditorConfig: T.ComponentEditorConfig = [
  { kind: 'fixed', data: { label: 'Stick' } },
  {
    kind: 'bindings',
    data: {
      bindings: [
        { key: 'x', label: 'X-Axis', inputKind: 'axis' },
        { key: 'y', label: 'Y-Axis', inputKind: 'axis' },
        { key: 'button', label: 'Button', inputKind: 'button' },
      ],
    },
  },
];

export interface StickInput extends Record<string, T.Input> {
  x: T.AxisInput;
  y: T.AxisInput;
  button: T.ButtonInput;
}

const defaultInput: StickInput = {
  x: { kind: 'axis', input: 0 },
  y: { kind: 'axis', input: 0 },
  button: { kind: 'button', input: false },
};

export type StickComponentConfig = StickConfig &
  T.BaseComponentConfig<StickInput>;

const depthFactor = (t: number): number =>
  t > 0.2 ? 1 - 0.08 * Math.abs(t) : 1 - 0.02 * Math.abs(t);

export class StickComponent extends TypedComponent<StickInput> {
  protected config: Required<StickComponentConfig>;
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

  update(input: StickInput): void {
    const { x, y, button } = this.computeRawInput(input);

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

    this.stick.fill(button ? pressedStickFill : stickFill);

    this.stick.shadowOffset({
      x: sign(x) * depthFactor(x) * -1,
      y: sign(y) * depthFactor(y) * -1,
    });
  }
}
