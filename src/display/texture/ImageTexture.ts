import Konva from 'konva';
import * as T from '../../types';
import { vec2 } from '../../utils';

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
    getter: t => t.src,
    setter: (t, src) => ({ ...t, src }),
  } as T.TextureField<'image', 'string'>,
  {
    key: 'offset',
    label: 'Offset',
    kind: 'Vec2',
    defaultValue: { x: 0, y: 0 },
    getter: t => t.offset,
    setter: (t, offset) => ({ ...t, offset }),
  } as T.TextureField<'image', 'Vec2'>,
];

export class ImageTexture implements T.Texture<'image'> {
  kind: 'image';
  state: ImageTextureState;
  private image: HTMLImageElement;
  private loadState: ImageLoadState;

  constructor(state: ImageTextureState) {
    this.state = state;

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

  apply = (model: Konva.Shape): void => {
    model.fillPriority('pattern');

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
