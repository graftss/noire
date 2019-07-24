import * as T from '../../types';
import { FillTexture, FillTextureState } from './FillTexture';
import { ImageTexture, ImageTextureState } from './ImageTexture';

export type SerializedTexture =
  | T.TypedSerializedTexture<'fill', FillTextureState>
  | T.TypedSerializedTexture<'image', ImageTextureState>;

export type Texture = FillTexture | ImageTexture;

export const deserializeTexture = (
  serialized: SerializedTexture,
): T.Texture => {
  switch (serialized.kind) {
    case 'fill':
      return new FillTexture(serialized.state);
    case 'image':
      return new ImageTexture(serialized.state);
  }
};
