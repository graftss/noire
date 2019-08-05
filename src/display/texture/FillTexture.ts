import Konva from 'konva';
import * as T from '../../types';

export type FillTextureState = Partial<{
  fill: string;
  stroke: string;
  strokeWidth: number;
}>;

export class FillTexture extends T.TypedTexture<'fill', FillTextureState> {
  constructor(state: FillTextureState) {
    super('fill', state);
  }

  updateState(updates: Partial<FillTextureState>): void {
    this.state = { ...this.state, ...updates };
  }

  apply = (model: Konva.Shape): void => {
    model.fillPriority('color');
    if (this.state.fill) model.fill(this.state.fill);
    if (this.state.stroke) model.stroke(this.state.stroke);
    if (this.state.strokeWidth) model.strokeWidth(this.state.strokeWidth);
  };
}
