import Konva from 'konva';
import * as T from '../../types';
import { find, keys } from '../../utils';
import { FillTexture, fillTextureFields } from './FillTexture';
import { ImageTexture, imageTextureFields } from './ImageTexture';

export interface TextureData {
  fill: { class: FillTexture; state: T.FillTextureState };
  image: { class: ImageTexture; state: T.ImageTextureState };
}

export type TextureKind = keyof TextureData;

type TextureConstructor<K extends TextureKind> = (
  s: TextureData[K]['state'],
) => Texture<K>;

const textureConstructors: {
  [K in TextureKind]: TextureConstructor<K>;
} = {
  fill: s => new FillTexture(s),
  image: s => new ImageTexture(s),
};

const textureFields: { [K in TextureKind]: TextureField<K>[] } = {
  fill: fillTextureFields,
  image: imageTextureFields,
};

export const textureKinds: TextureKind[] = keys(textureConstructors);

export interface SerializedTexture<K extends TextureKind = TextureKind> {
  kind: K;
  state: TextureData[K]['state'];
}

export interface Texture<K extends TextureKind = TextureKind>
  extends SerializedTexture<K> {
  apply: (model: Konva.Shape) => void;
  update: (update: Partial<TextureData[K]['state']>) => void;
}

export interface TextureField<
  K extends TextureKind = TextureKind,
  FK extends T.EditorFieldKind = T.EditorFieldKind
> extends T.EditorField<FK> {
  key: string;
  label: string;
  kind: FK;
  defaultValue: T.EditorFieldType<FK>;
  getter: (texture: SerializedTexture<K>) => T.EditorFieldType<FK>;
  setter: (
    texture: SerializedTexture<K>,
    value: T.EditorFieldType<FK>,
  ) => SerializedTexture<K>;
}

export const serializeTexture = <K extends TextureKind>({
  kind,
  state,
}: Texture<K>): SerializedTexture<K> => ({ state, kind });

export const deserializeTexture = <K extends TextureKind>({
  kind,
  state,
}: SerializedTexture<K>): Texture<K> =>
  (textureConstructors[kind] as TextureConstructor<K>)(state);

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
  const field = findTextureFieldByKey(texture.kind, key);
  return field ? field.setter(texture, value) : texture;
};
