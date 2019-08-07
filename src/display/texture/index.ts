import Konva from 'konva';
import * as T from '../../types';
import { find } from '../../utils';
import { FillTexture, fillTextureFields } from './FillTexture';
import { ImageTexture, imageTextureFields } from './ImageTexture';

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

export interface TextureField<
  K extends TextureKind = TextureKind,
  FK extends T.EditorFieldKind = T.EditorFieldKind
> extends T.EditorField<FK> {
  key: string;
  label: string;
  kind: FK;
  defaultValue: T.EditorFieldType<FK>;
  getter: (texture: TextureData[K]['state']) => T.EditorFieldType<FK>;
  setter: (
    texture: TextureData[K]['state'],
    value: T.EditorFieldType<FK>,
  ) => TextureData[K]['state'];
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

const textureFields: { [K in TextureKind]: TextureField<K>[] } = {
  fill: fillTextureFields,
  image: imageTextureFields,
};

export const getTextureFields = <K extends TextureKind>(
  kind: K,
): TextureField<K>[] => textureFields[kind] as TextureField<K>[];

export const findTextureFieldByKey = <K extends TextureKind>(
  kind: K,
  key: string,
): Maybe<TextureField<K>> =>
  find(field => field.key === key, getTextureFields(kind));

export const updateTexture = <K extends TextureKind>(
  texture: SerializedTexture<K>,
  key: string,
  value: any,
): SerializedTexture<K> => {
  const { kind, state } = texture;
  const field = findTextureFieldByKey(kind, key);
  return field ? { kind, state: field.setter(state, value) } : texture;
};
