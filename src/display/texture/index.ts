import * as T from '../../types';
import { find, keys } from '../../utils';
import { FillTexture, fillTextureFields } from './FillTexture';
import { ImageTexture, imageTextureFields } from './ImageTexture';
import { HiddenTexture, hiddenTextureFields } from './HiddenTexture';
import { Texture } from './Texture';

export interface TextureData {
  fill: { class: FillTexture; state: T.FillTextureState };
  hidden: { class: HiddenTexture; state: T.HiddenTextureState };
  image: { class: ImageTexture; state: T.ImageTextureState };
}

export type TextureKind = keyof TextureData;

export type TextureState<K extends TextureKind> = TextureData[K]['state'];

type TextureConstructor<K extends TextureKind> = (
  s?: TextureState<K>,
) => Texture<K>;

const textureConstructors: {
  [K in TextureKind]: TextureConstructor<K>;
} = {
  fill: s => new FillTexture(s),
  hidden: () => new HiddenTexture(),
  image: s => new ImageTexture(s),
};

const textureFields: { [K in TextureKind]: TextureField<K>[] } = {
  fill: fillTextureFields,
  hidden: hiddenTextureFields,
  image: imageTextureFields,
};

const textureKinds: TextureKind[] = keys(textureConstructors);

export interface SerializedTexture<K extends TextureKind = TextureKind> {
  kind: K;
  state: TextureData[K]['state'];
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

export const defaultTexture = <K extends TextureKind>(
  kind: TextureKind,
): Texture<K> => (textureConstructors[kind] as TextureConstructor<K>)();

export const defaultSerializedTexture = <K extends TextureKind>(
  kind: TextureKind,
): SerializedTexture<K> =>
  serializeTexture((textureConstructors[kind] as TextureConstructor<K>)());

export const getTextureFields = <K extends TextureKind>(
  kind: K,
): TextureField<K>[] => textureFields[kind] as TextureField<K>[];

export const getTextureKinds = (): TextureKind[] => [...textureKinds];

export const findTextureFieldByKey = <K extends TextureKind>(
  kind: K,
  key: string,
): Maybe<TextureField<K>> =>
  find(field => field.key === key, getTextureFields(kind));

export const setTexture = <K extends TextureKind>(
  texture: SerializedTexture<K>,
  key: string,
  value: any,
): SerializedTexture<K> => {
  const field = findTextureFieldByKey(texture.kind, key);
  return field ? field.setter(texture, value) : texture;
};
