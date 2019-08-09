import * as T from '../../types';
import { mapPath } from '../../utils';
import { Texture } from './Texture';

export interface FillTextureState {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

const defaultFillTextureState: FillTextureState = {
  fill: 'rgba(0,0,0,0)',
  stroke: 'rgba(0,0,0,0)',
  strokeWidth: 0,
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
    model.clearCache();
    model.fillPriority('color');
    if (this.state.fill) model.fill(this.state.fill);
    if (this.state.stroke) model.stroke(this.state.stroke);
    if (this.state.strokeWidth) model.strokeWidth(this.state.strokeWidth);
    model.cache(null);
  };
}
