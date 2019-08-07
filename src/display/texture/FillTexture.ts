import Konva from 'konva';
import * as T from '../../types';

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
    getter: t => t.fill,
    setter: (t, fill) => ({ ...t, fill }),
  } as T.TextureField<'fill', 'string'>,
  {
    key: 'stroke',
    label: 'Stroke',
    kind: 'string',
    defaultValue: 'black',
    getter: t => t.stroke,
    setter: (t, stroke) => ({ ...t, stroke }),
  } as T.TextureField<'fill', 'string'>,
  {
    key: 'strokeWidth',
    label: 'Stroke width',
    kind: 'number',
    defaultValue: 1,
    getter: t => t.strokeWidth,
    setter: (t, strokeWidth) => ({ ...t, strokeWidth }),
  } as T.TextureField<'fill', 'number'>,
];

export class FillTexture implements T.Texture<'fill'> {
  kind: 'fill';
  state: FillTextureState;

  constructor(state: FillTextureState) {
    this.state = state;
  }

  apply = (model: Konva.Shape): void => {
    model.fillPriority('color');
    if (this.state.fill) model.fill(this.state.fill);
    if (this.state.stroke) model.stroke(this.state.stroke);
    if (this.state.strokeWidth) model.strokeWidth(this.state.strokeWidth);
  };
}
