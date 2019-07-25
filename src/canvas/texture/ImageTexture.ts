import Konva from 'konva';
import * as T from '../../types';
import { vec2 } from '../../utils';
import { DistortFilter } from './filters';

export interface ImageTextureState {
  src: string;
  offset: Vec2;
}

type ImageLoadState = 'requested' | 'loaded';

export class ImageTexture extends T.TypedTexture<'image', ImageTextureState> {
  private image: HTMLImageElement;
  private loadState: ImageLoadState;

  constructor(state: ImageTextureState) {
    super('image', state);

    this.image = new Image();
    this.image.src = state.src;
    this.loadState = 'requested';

    this.image.onload = () => (this.loadState = 'loaded');
  }

  moveBy = (v: Vec2): void => {
    this.state.offset = vec2.add(this.state.offset, v);
  };

  moveTo = (v: Vec2): void => {
    this.state.offset = v;
  };

  apply = (shape: Konva.Shape): void => {
    shape.fillPriority('pattern');

    shape.cache(0);

    switch (this.loadState) {
      case 'loaded': {
        shape.fillPatternImage(this.image);
        shape.fillPatternOffset(this.state.offset);
        break;
      }
    }
  };
}
