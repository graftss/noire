import * as T from '../../types';
import { mapPath } from '../../utils';
import { Texture } from './Texture';

export interface FillTextureState {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

const defaultFillTextureState: FillTextureState = {
  fill: 'black',
  stroke: 'red',
  strokeWidth: 1,
};

export const fillTextureFields: T.TextureField<'fill'>[] = [
  {
    key: 'fill',
    label: 'Fill',
    kind: 'string',
    defaultValue: defaultFillTextureState.fill,
    getter: t => t.state.fill,
    setter: (t, fill) => mapPath(['state', 'fill'], () => fill, t),
  } as T.TextureField<'fill', 'string'>,
  {
    key: 'stroke',
    label: 'Stroke',
    kind: 'string',
    defaultValue: defaultFillTextureState.stroke,
    getter: t => t.state.stroke,
    setter: (t, stroke) => mapPath(['state', 'stroke'], () => stroke, t),
  } as T.TextureField<'fill', 'string'>,
  {
    key: 'strokeWidth',
    label: 'Stroke width',
    kind: 'number',
    defaultValue: defaultFillTextureState.strokeWidth,
    getter: t => t.state.strokeWidth,
    setter: (t, strokeWidth) =>
      mapPath(['state', 'strokeWidth'], () => strokeWidth, t),
  } as T.TextureField<'fill', 'number'>,
];

export class FillTexture extends Texture<'fill'> {
  readonly kind = 'fill';

  constructor(state?: FillTextureState) {
    super({ ...defaultFillTextureState, ...state });
  }

  applyToModel = (model: T.KonvaModel): void => {
    const { fill, stroke, strokeWidth } = this.state;

    model.fillPriority('color');
    model.fill(fill);
    model.stroke(stroke);
    model.strokeWidth(strokeWidth);
    model.cache(null);
  };

  cleanup(model: T.KonvaModel): void {
    model.clearCache();
    model.fill('rgba(0,0,0,0)');
    model.stroke('rgba(0,0,0,0)');
    model.strokeWidth(0);
  }
}
