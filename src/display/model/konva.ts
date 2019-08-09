import Konva from 'konva';
import * as T from '../../types';
import { find, keys } from '../../utils';
import { rectModelFields, defaultRectAttrs } from './Rect';
import {
  circleModelFields,
  defaultCircleAttrs,
  KonvaCircleModel,
} from './Circle';

export interface KonvaModelData {
  Rect: T.KonvaRectData;
  Circle: T.KonvaCircleData;
}

export type KonvaModelKind = keyof KonvaModelData;
export type KonvaModelAttrs<
  K extends KonvaModelKind
> = KonvaModelData[K]['attrs'];

export type KonvaModel<
  K extends KonvaModelKind = KonvaModelKind
> = KonvaModelData[K]['class'] & {
  lastTextureHash?: string;
  dirty?: boolean;
};

export interface SerializedKonvaModel<
  K extends KonvaModelKind = KonvaModelKind
> {
  kind: K;
  attrs: KonvaModelData[K]['attrs'];
}

export interface KonvaModelField<
  K extends KonvaModelKind = KonvaModelKind,
  FK extends T.EditorFieldKind = T.EditorFieldKind
> extends T.EditorField<FK> {
  key: string;
  label: string;
  kind: FK;
  defaultValue: T.EditorFieldType<FK>;
  getter: (model: KonvaModelData[K]['class']) => T.EditorFieldType<FK>;
  serialGetter: (model: SerializedKonvaModel<K>) => T.EditorFieldType<FK>;
  setter: (
    model: KonvaModelData[K]['class'],
    value: T.EditorFieldType<FK>,
  ) => KonvaModelData[K]['class'];
  serialSetter: (
    model: SerializedKonvaModel<K>,
    value: T.EditorFieldType<FK>,
  ) => SerializedKonvaModel<K>;
}

const konvaModelFields: {
  [K in KonvaModelKind]: readonly KonvaModelField<K>[];
} = {
  Rect: rectModelFields,
  Circle: circleModelFields,
} as const;

const konvaModelKinds: KonvaModelKind[] = keys(konvaModelFields);

const defaultKonvaModelAttrs: {
  [K in KonvaModelKind]: KonvaModelAttrs<K>;
} = {
  Rect: defaultRectAttrs,
  Circle: defaultCircleAttrs,
};

const konvaModelConstructors: {
  [K in KonvaModelKind]: (a?: KonvaModelAttrs<K>) => KonvaModel<K>;
} = {
  Rect: attrs => new Konva.Rect(attrs),
  Circle: attrs => new KonvaCircleModel(attrs),
};

export const getKonvaModelFields = <K extends KonvaModelKind>(
  kind: K,
): KonvaModelField<K>[] => konvaModelFields[kind] as KonvaModelField<K>[];

export const getKonvaModelKinds = (): KonvaModelKind[] => [...konvaModelKinds];

export const findKonvaFieldByKey = <K extends KonvaModelKind>(
  kind: K,
  key: string,
): Maybe<KonvaModelField<K>> =>
  find(field => field.key === key, getKonvaModelFields(kind));

export const updateSerializedKonvaModel = <K extends KonvaModelKind>(
  model: SerializedKonvaModel<K>,
  key: string,
  value: any,
): SerializedKonvaModel<K> => {
  const field = findKonvaFieldByKey(model.kind, key);
  return field ? field.serialSetter(model, value) : model;
};

export const updateKonvaModel = <K extends KonvaModelKind>(
  model: KonvaModel<K>,
  key: string,
  value: any,
): KonvaModel<K> => {
  const field = findKonvaFieldByKey(model.className as KonvaModelKind, key);
  return field ? field.setter(model, value) : model;
};

export const serializeKonvaModel = <K extends KonvaModelKind>(
  node: KonvaModel<K>,
): SerializedKonvaModel<K> => {
  const result = JSON.parse(node.toJSON());
  return { ...result, kind: result.className };
};

export const deserializeKonvaModel = <K extends KonvaModelKind>(
  model: SerializedKonvaModel<K>,
): KonvaModel<K> => konvaModelConstructors[model.kind](model.attrs as any);

export const defaultSerializedKonvaModel = <K extends KonvaModelKind>(
  kind: K,
): SerializedKonvaModel<K> => ({ kind, attrs: defaultKonvaModelAttrs[kind] });

export const defaultKonvaModel = <K extends KonvaModelKind>(
  kind: K,
): KonvaModel<K> => deserializeKonvaModel(defaultSerializedKonvaModel(kind));

export const isKonvaModelCached = (node: Konva.Node): boolean =>
  node._isUnderCache;
