import * as T from '../../types';
import { mapPath } from '../../utils';
import { Texture } from './Texture';

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

export class ImageTexture extends Texture<'image'> {
  readonly kind = 'image';
  private image: HTMLImageElement;
  private loadState: ImageLoadState;
  state: ImageTextureState;

  constructor(state?: ImageTextureState) {
    super({ ...defaultImageTextureState, ...state });
    if (state && state.src) this.loadImage(this.state.src);
  }

  private loadImage(src: string): void {
    this.image = new Image();
    this.image.src = src;
    this.image.onload = () => (this.loadState = 'loaded');
    this.image.onerror = () => (this.loadState = 'error');

    this.loadState = 'requested';
    this.state.src = src;
  }

  update(update: Partial<ImageTextureState>): void {
    super.update(update);
    if (update.src !== undefined) this.loadImage(update.src);
  }

  fillImage(model: T.KonvaModel): void {
    model.fillPriority('pattern');
    model.fillPatternRepeat('no-repeat');
    model.fillPatternImage(this.image);
    model.fillPatternOffset(this.state.offset);
    model.cache(null);
  }

  applyToModel(model: T.KonvaModel): void {
    if (this.loadState === 'loaded') this.fillImage(model);
    else this.image.addEventListener('load', () => this.fillImage(model));
  }

  cleanup(model: T.KonvaModel): void {
    model.clearCache();
  }
}
