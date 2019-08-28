import Konva from 'konva';
import * as T from '../../types';
import { keys, validateJSONString } from '../../utils';
import { Texture } from '../texture/Texture';
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
  lastTexture?: Texture;
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
  getter: (model: SerializedKonvaModel<K>) => T.EditorFieldType<FK>;
  setter: (
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
  attrs?: Partial<KonvaModelAttrs<K>>,
): SerializedKonvaModel<K> => ({
  kind,
  attrs: { ...defaultKonvaModelAttrs[kind], ...attrs },
});

export const defaultKonvaModel = <K extends KonvaModelKind>(
  kind: K,
): KonvaModel<K> => deserializeKonvaModel(defaultSerializedKonvaModel(kind));

const validateModel = (o: any): boolean =>
  typeof o === 'object' &&
  konvaModelKinds.includes(o.kind) &&
  typeof o.attrs === 'object';

export const stringToModel: (
  str: string,
) => Maybe<SerializedKonvaModel> = validateJSONString(validateModel);

export const modelToString = (model: SerializedKonvaModel): string =>
  JSON.stringify(model);
