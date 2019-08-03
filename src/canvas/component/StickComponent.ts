import * as T from '../../types';
import { normalizeAxis } from '../../utils';
import { Component } from './Component';

const stickShapes = ['boundary', 'stick', 'center'] as const;
type StickShapes = typeof stickShapes[number];

const stickTextures = ['boundary', 'stick', 'stickDown', 'center'] as const;
type StickTextures = typeof stickTextures[number];

export const stickInputKinds = {
  xp: 'axis',
  xn: 'axis',
  yp: 'axis',
  yn: 'axis',
  button: 'button',
} as const;

export type StickInput = T.KindsToRaw<typeof stickInputKinds>;

const stickKeys: T.ComponentKey[] = [
  { key: 'xp', label: 'Right', inputKind: 'axis' },
  { key: 'xn', label: 'Left', inputKind: 'axis' },
  { key: 'yp', label: 'Down', inputKind: 'axis' },
  { key: 'yn', label: 'Up', inputKind: 'axis' },
  { key: 'button', label: 'Trigger', inputKind: 'button' },
];

export type StickState = T.ComponentState<typeof stickInputKinds> & {
  boundaryRadius: number;
  useDepthScaling: boolean;
};

export const defaultStickState: StickState = {
  name: 'Stick Component',
  boundaryRadius: 26,
  useDepthScaling: false,
};

export type SerializedStickComponent = T.Serialized<
  'stick',
  StickShapes,
  StickTextures,
  typeof stickInputKinds,
  StickState
>;

const stickEditorState: T.ComponentEditorField[] = [
  { kind: 'boolean', label: 'Depth scaling', stateKey: 'useDepthScaling' },
  { kind: 'number', label: 'Boundary radius', stateKey: 'boundaryRadius' },
];

export const stickEditorConfig: T.ComponentEditorConfig = {
  title: 'Stick',
  state: stickEditorState,
  keys: stickKeys,
  shapes: stickShapes,
  textures: stickTextures,
};

const depthFactor = (t: number): number =>
  t > 0.2 ? 1 - 0.08 * Math.abs(t) : 1 - 0.02 * Math.abs(t);

export class StickComponent extends Component<
  StickShapes,
  StickTextures,
  typeof stickInputKinds,
  StickState
> {
  constructor(
    id: string,
    graphics: T.ComponentGraphics<StickShapes, StickTextures>,
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
    const { boundaryRadius } = this.state;

    return {
      x: x * boundaryRadius,
      y: y * boundaryRadius,
    };
  }

  private updateBoundary(): void {
    const shape = this.graphics.shapes.boundary;
    const texture = this.graphics.textures.boundary;

    if (shape && texture) {
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
    const { xn, xp, yn, yp, button } = input;
    const x = normalizeAxis(xp, xn);
    const y = normalizeAxis(yp, yn);

    this.updateBoundary();
    this.updateCenter(x, y);
    this.updateStick(x, y, button);
  }
}
