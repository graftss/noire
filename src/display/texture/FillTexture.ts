import Konva from 'konva';
import * as T from '../../types';
import { mapPath } from '../../utils';

export interface FillTextureState {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export const fillTextureFields: T.TextureField<'fill'>[] = [
  {
    key: 'fill',
    label: 'Fill',
    kind: 'string',
    defaultValue: 'red',
    getter: t => t.state.fill,
    setter: (t, fill) => mapPath(['state', 'fill'], () => fill, t),
  } as T.TextureField<'fill', 'string'>,
  {
    key: 'stroke',
    label: 'Stroke',
    kind: 'string',
    defaultValue: 'black',
    getter: t => t.state.stroke,
    setter: (t, stroke) => mapPath(['state', 'stroke'], () => stroke, t),
  } as T.TextureField<'fill', 'string'>,
  {
    key: 'strokeWidth',
    label: 'Stroke width',
    kind: 'number',
    defaultValue: 1,
    getter: t => t.state.strokeWidth,
    setter: (t, strokeWidth) =>
      mapPath(['state', 'strokeWidth'], () => strokeWidth, t),
  } as T.TextureField<'fill', 'number'>,
];

export class FillTexture implements T.Texture<'fill'> {
  kind: 'fill';
  state: FillTextureState;

  constructor(state: FillTextureState) {
    this.state = state;
  }

  update = (update: Partial<FillTextureState>): void => {
    this.state = { ...this.state, ...update };
  };

  apply = (model: Konva.Shape): void => {
    model.fillPriority('color');
    if (this.state.fill) model.fill(this.state.fill);
    if (this.state.stroke) model.stroke(this.state.stroke);
    if (this.state.strokeWidth) model.strokeWidth(this.state.strokeWidth);
  };
}
