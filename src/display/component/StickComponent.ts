import * as T from '../../types';
import { normalizeAxis } from '../../utils';
import { Component } from './Component';

const stickModels = ['boundary', 'stick', 'center'] as const;
type StickModels = typeof stickModels[number];

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

export const defaultState: StickState = {
  name: 'Stick Component',
  boundaryRadius: 26,
  useDepthScaling: false,
};

export type SerializedStickComponent = T.SerializedComponent<
  'stick',
  StickModels,
  StickTextures,
  typeof stickInputKinds,
  StickState
>;

const stickEditorState: T.ComponentStateEditorField[] = [
  {
    kind: 'boolean',
    label: 'Depth scaling',
    key: 'useDepthScaling',
    getter: c => c.useDepthScaling,
    setter: (c, useDepthScaling) => ({ ...c, useDepthScaling }),
  } as T.ComponentStateEditorField<'boolean', 'stick'>,
  {
    kind: 'number',
    label: 'Movement radius',
    key: 'boundaryRadius',
    props: { precision: 1 },
    getter: c => c.boundaryRadius,
    setter: (c, boundaryRadius) => ({ ...c, boundaryRadius }),
  } as T.ComponentStateEditorField<'number', 'stick'>,
];

export const stickEditorConfig: T.ComponentEditorConfig = {
  title: 'Stick',
  state: stickEditorState,
  keys: stickKeys,
  models: stickModels,
  textures: stickTextures,
};

const depthFactor = (t: number): number =>
  t > 0.2 ? 1 - 0.08 * Math.abs(t) : 1 - 0.02 * Math.abs(t);

export class StickComponent extends Component<
  StickModels,
  StickTextures,
  typeof stickInputKinds,
  StickState
> {
  constructor(
    id: string,
    graphics: T.ComponentGraphics<StickModels, StickTextures>,
    state: Partial<StickState>,
    filters: T.ComponentFilterDict<StickModels>,
  ) {
    super(
      id,
      graphics,
      stickInputKinds,
      { ...defaultState, ...state },
      filters,
    );
  }

  init(): void {
    const { boundary } = this.graphics.models;
    if (boundary) boundary.moveToBottom();
  }

  private stickOffset(x: number, y: number): Vec2 {
    const { boundaryRadius } = this.state;

    return {
      x: -x * boundaryRadius,
      y: -y * boundaryRadius,
    };
  }

  private updateBoundary(): void {
    const model = this.graphics.models.boundary;
    const texture = this.graphics.textures.boundary;

    if (model && texture) {
      texture.apply(model);
    }
  }

  private updateCenter(x: number, y: number): void {
    const model = this.graphics.models.center;
    const texture = this.graphics.textures.center;

    if (model && texture) {
      model.offset(this.stickOffset(x, y));
      texture.apply(model);
    }
  }

  private updateStick(x: number, y: number, down: boolean): void {
    const model = this.graphics.models.stick;
    if (!model) return;

    model.offset(this.stickOffset(x, y));

    if (this.state.useDepthScaling) {
      model.scale({
        x: depthFactor(Math.abs(x)),
        y: depthFactor(Math.abs(y)),
      });
    } else {
      model.scale({ x: 1, y: 1 });
    }

    const texture =
      down && this.graphics.textures.stickDown
        ? this.graphics.textures.stickDown
        : this.graphics.textures.stick;

    if (texture) texture.apply(model);
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
