import Konva from 'konva';
import * as T from '../../types';

export type FillTextureState = Partial<{
  fill: string;
  stroke: string;
  strokeWidth: number;
}>;

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
