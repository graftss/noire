import Konva from 'konva';
import * as T from '../../types';
import { mapPath } from '../../utils';

export interface ImageTextureState {
  src: string;
  offset: Vec2;
}

type ImageLoadState = 'requested' | 'loaded';

export const imageTextureFields: T.TextureField<'image'>[] = [
  {
    key: 'src',
    label: 'Image URL',
    kind: 'string',
    defaultValue: '',
    getter: t => t.state.src,
    setter: (t, src) => mapPath(['state', 'src'], () => src, t),
  } as T.TextureField<'image', 'string'>,
  {
    key: 'offset',
    label: 'Offset',
    kind: 'Vec2',
    defaultValue: { x: 0, y: 0 },
    getter: t => t.state.offset,
    setter: (t, offset) => mapPath(['state', 'offset'], () => offset, t),
  } as T.TextureField<'image', 'Vec2'>,
];

export class ImageTexture implements T.Texture<'image'> {
  kind: 'image';
  state: ImageTextureState;
  private image: HTMLImageElement;
  private loadState: ImageLoadState;

  constructor(state: ImageTextureState) {
    this.state = state;
    this.loadImage(state.src);
  }

  private loadImage(src: string): void {
    if (src === undefined) return;

    this.image = new Image();
    this.image.src = src;
    this.image.onload = () => (this.loadState = 'loaded');

    this.loadState = 'requested';
    this.state.src = src;
  }

  update = (update: Partial<ImageTextureState>): void => {
    const { src, ...rest } = update;

    if (src !== undefined) this.loadImage(src);
    this.state = { ...this.state, ...rest };
  };

  apply = (model: Konva.Shape): void => {
    model.fillPriority('pattern');
    model.fillPatternRepeat('no-repeat');

    model.cache(0);

    switch (this.loadState) {
      case 'loaded': {
        model.fillPatternImage(this.image);
        model.fillPatternOffset(this.state.offset);
        break;
      }
    }
  };
}
