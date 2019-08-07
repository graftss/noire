import Konva from 'konva';
import * as T from '../../types';
import { FillTexture } from './FillTexture';
import { ImageTexture } from './ImageTexture';

export interface TextureData {
  fill: { class: FillTexture; kind: 'fill'; state: T.FillTextureState };
  image: { class: ImageTexture; kind: 'image'; state: T.ImageTextureState };
}

export type TextureKind = keyof TextureData;

export interface SerializedTexture<K extends TextureKind = TextureKind> {
  kind: K;
  state: TextureData[K]['state'];
}

export interface Texture<K extends TextureKind = TextureKind>
  extends SerializedTexture<K> {
  apply: (model: Konva.Shape) => void;
}

export const serializeTexture = <K extends TextureKind>({
  kind,
  state,
}: Texture<K>): SerializedTexture<K> => ({ state, kind });

export const deserializeTexture = <K extends TextureKind>(
  serialized: SerializedTexture<K>,
): Texture<K> => {
  switch (serialized.kind) {
    case 'fill':
      return new FillTexture(serialized.state as T.FillTextureState) as any;
    case 'image':
      return new ImageTexture(serialized.state as T.ImageTextureState) as any;
  }

  throw new Error('unrecognized texture kind');
};
