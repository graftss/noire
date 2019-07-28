import * as T from '../../types';
import { normalizeAxis } from '../../utils';
import { TypedComponent } from './Component';

type StickShapes = 'boundary' | 'stick' | 'center';
type StickTextures = 'boundary' | 'stick' | 'stickDown' | 'center';

export type StickGraphics = T.ComponentGraphics<StickShapes, StickTextures>;

export interface StickInput extends Dict<T.Input> {
  xp: T.AxisInput;
  xn: T.AxisInput;
  yp: T.AxisInput;
  yn: T.AxisInput;
  button: T.ButtonInput;
}

export const stickInputKinds: T.InputKindProjection<StickInput> = {
  xp: 'axis',
  xn: 'axis',
  yp: 'axis',
  yn: 'axis',
  button: 'button',
};

export type StickState = T.BaseComponentState<StickInput> & {
  boundaryRadius: number;
  center: Vec2;
  useDepthScaling: boolean;
};

export const defaultStickState: StickState = {
  boundaryRadius: 26,
  center: { x: 0, y: 0 },
  useDepthScaling: false,
  inputMap: {},
};

export type SerializedStickComponent = T.Serialized<
  'stick',
  StickShapes,
  StickTextures,
  StickState,
  StickInput
>;

export const stickEditorConfig: T.ComponentEditorConfig = [
  { kind: 'fixed', data: { label: 'Stick' } },
  {
    kind: 'keys',
    data: {
      keys: [
        { key: 'xp', label: 'Right', inputKind: 'axis' },
        { key: 'xn', label: 'Left', inputKind: 'axis' },
        { key: 'yp', label: 'Down', inputKind: 'axis' },
        { key: 'yn', label: 'Up', inputKind: 'axis' },
        { key: 'button', label: 'Button', inputKind: 'button' },
      ],
    },
  },
];

const depthFactor = (t: number): number =>
  t > 0.2 ? 1 - 0.08 * Math.abs(t) : 1 - 0.02 * Math.abs(t);

export class StickComponent extends TypedComponent<
  StickShapes,
  StickTextures,
  StickGraphics,
  StickInput,
  StickState
> {
  constructor(
    id: string,
    graphics: StickGraphics,
    state: Partial<StickState>,
    filters: T.ComponentFilterDict<StickShapes>,
  ) {
    super(
      id,
      graphics,
      stickInputKinds,
      { ...defaultStickState, ...state },
      filters,
    );
  }

  init(): void {
    const { boundary } = this.graphics.shapes;
    if (boundary) boundary.moveToBottom();
  }

  private centerPosition(x: number, y: number): Vec2 {
    const { center, boundaryRadius } = this.state;

    return {
      x: center.x + x * boundaryRadius,
      y: center.y + y * boundaryRadius,
    };
  }

  private updateBoundary(): void {
    const shape = this.graphics.shapes.boundary;
    const texture = this.graphics.textures.boundary;
    const { center } = this.state;

    if (shape && texture) {
      shape.position(center);
      texture.apply(shape);
    }
  }

  private updateCenter(x: number, y: number): void {
    const shape = this.graphics.shapes.center;
    const texture = this.graphics.textures.center;

    if (shape && texture) {
      shape.position(this.centerPosition(x, y));
      texture.apply(shape);
    }
  }

  private updateStick(x: number, y: number, down: boolean): void {
    const shape = this.graphics.shapes.stick;
    if (!shape) return;

    shape.position(this.centerPosition(x, y));

    if (this.state.useDepthScaling) {
      shape.scale({
        x: depthFactor(Math.abs(x)),
        y: depthFactor(Math.abs(y)),
      });
    }

    const texture =
      down && this.graphics.textures.stickDown
        ? this.graphics.textures.stickDown
        : this.graphics.textures.stick;

    if (texture) texture.apply(shape);
  }

  update(input: StickInput): void {
    const { xn, xp, yn, yp, button } = this.computeRawInput(input);
    const x = normalizeAxis(xp, xn);
    const y = normalizeAxis(yp, yn);

    this.updateBoundary();
    this.updateCenter(x, y);
    this.updateStick(x, y, button);
  }
}
