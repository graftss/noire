import Konva from 'konva';
import * as T from '../../types';
import { mapPath } from '../../utils';

export interface ImageTextureState {
  src: string;
  offset: Vec2;
}

const defaultImageTextureState: ImageTextureState = {
  src: '',
  offset: { x: 0, y: 0 },
};

type ImageLoadState = 'requested' | 'loaded' | 'error';

export const imageTextureFields: T.TextureField<'image'>[] = [
  {
    key: 'src',
    label: 'Image URL',
    kind: 'string',
    defaultValue: defaultImageTextureState.src,
    getter: t => t.state.src,
    setter: (t, src) => mapPath(['state', 'src'], () => src, t),
  } as T.TextureField<'image', 'string'>,
  {
    key: 'offset',
    label: 'Offset',
    kind: 'Vec2',
    defaultValue: defaultImageTextureState.offset,
    getter: t => t.state.offset,
    setter: (t, offset) => mapPath(['state', 'offset'], () => offset, t),
  } as T.TextureField<'image', 'Vec2'>,
];

export class ImageTexture implements T.Texture<'image'> {
  readonly kind = 'image';
  state: ImageTextureState;
  private image: HTMLImageElement;
  private loadState: ImageLoadState;

  constructor(state?: ImageTextureState) {
    this.state = { ...defaultImageTextureState, ...state };
    this.loadImage(this.state.src);
  }

  private loadImage(src: string): void {
    this.image = new Image();
    this.image.src = src;
    this.image.onload = () => (this.loadState = 'loaded');
    this.image.onerror = () => (this.loadState = 'error');

    this.loadState = 'requested';
    this.state.src = src;
  }

  update = (update: Partial<ImageTextureState>): void => {
    const { src, ...rest } = update;

    if (src !== undefined) this.loadImage(src);
    this.state = { ...this.state, ...rest };
  };

  apply = (model: Konva.Shape): void => {
    switch (this.loadState) {
      case 'loaded': {
        model.fillPriority('pattern');
        model.fillPatternRepeat('no-repeat');
        model.fillPatternImage(this.image);
        model.fillPatternOffset(this.state.offset);
        break;
      }
      default: {
        model.fillPriority('color');
        model.fill('rgba(0,0,0,0)');
      }
    }
  };
}
