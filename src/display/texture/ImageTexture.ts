import * as T from '../../types';
import { assocPath } from '../../utils';
import { Texture } from './Texture';

export interface ImageTextureState {
  src: string;
  offset: Vec2;
  scale: Vec2;
}

const defaultImageTextureState: ImageTextureState = {
  src: '',
  offset: { x: 0, y: 0 },
  scale: { x: 1, y: 1 },
};

type ImageLoadState = 'requested' | 'loaded' | 'error';

export const imageTextureFields: T.TextureField<'image'>[] = [
  {
    key: 'src',
    label: 'Image URL',
    kind: 'string',
    defaultValue: defaultImageTextureState.src,
    getter: t => t.state.src,
    setter: (t, src) => assocPath(['state', 'src'], src, t),
  } as T.TextureField<'image', 'string'>,
  {
    key: 'offset',
    label: 'Image offset',
    kind: 'Vec2',
    defaultValue: defaultImageTextureState.offset,
    getter: t => t.state.offset,
    setter: (t, offset) => assocPath(['state', 'offset'], offset, t),
  } as T.TextureField<'image', 'Vec2'>,
  {
    key: 'scale',
    label: 'Image scale',
    kind: 'Vec2',
    defaultValue: defaultImageTextureState.scale,
    props: { precision: 3 },
    getter: t => t.state.scale,
    setter: (t, scale) => assocPath(['state', 'scale'], scale, t),
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
    this.image.crossOrigin = 'Anonymous';
    this.image.src = src;
    this.image.onload = () => (this.loadState = 'loaded');
    this.image.onerror = () => (this.loadState = 'error');

    this.loadState = 'requested';
    this.state.src = src;
  }

  update(update: Partial<ImageTextureState>): void {
    super.update(update);
    if (update.src && update.src !== this.state.src) this.loadImage(update.src);
  }

  fillImage(model: T.KonvaModel): void {
    model.fillPriority('pattern');
    model.fillPatternRepeat('no-repeat');
    model.fillPatternImage(this.image);
    model.fillPatternOffset(this.state.offset);
    model.fillPatternScale(this.state.scale);
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
