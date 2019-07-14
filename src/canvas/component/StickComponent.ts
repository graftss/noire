import Konva from 'konva';
import * as T from '../../types';
import { sign } from '../../utils';
import { TypedComponent } from './Component';

export interface StickInput extends Dict<T.Input> {
  x: T.AxisInput;
  y: T.AxisInput;
  button: T.ButtonInput;
}

export const stickInputKinds: T.Kinds<StickInput> = {
  x: 'axis',
  y: 'axis',
  button: 'button',
};

export interface StickState extends T.BaseComponentState<StickInput> {
  x: number;
  y: number;
  boundaryRadius: number;
  stickRadius: number;
  rangeScaling: number;
  stickFill: string;
  pressedStickFill: string;
}

export const defaultStickState: StickState = {
  x: 0,
  y: 0,
  boundaryRadius: 26,
  stickRadius: 4,
  rangeScaling: 0.5,
  stickFill: 'black',
  pressedStickFill: 'darkred',
  inputMap: {},
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

const depthFactor = (t: number): number =>
  t > 0.2 ? 1 - 0.08 * Math.abs(t) : 1 - 0.02 * Math.abs(t);

export class StickComponent extends TypedComponent<StickInput, StickState>
  implements T.GroupContainer {
  group: Konva.Group;
  private center: Konva.Circle;
  private stick: Konva.Ellipse;

  constructor(id: string, state?: Partial<StickState>) {
    super(id, { ...defaultStickState, ...state }, stickInputKinds);

    const { boundaryRadius, stickRadius, stickFill, x, y } = this.state;

    this.group = new Konva.Group({ x, y });
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
    } = this.state;

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
