import Konva from 'konva';
import * as T from '../../types';

export interface FillTextureState {
  fill: string;
}

export class FillTexture extends T.TypedTexture<'fill', FillTextureState> {
  constructor(state: FillTextureState) {
    super('fill', state);
  }

  updateState(updates: Partial<FillTextureState>): void {
    this.state = { ...this.state, ...updates };
  }

  apply = (shape: Konva.Shape): void => {
    shape.fillPriority('color');
    shape.fill(this.state.fill);
  };
}
