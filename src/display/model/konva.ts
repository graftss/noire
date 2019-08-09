import Konva from 'konva';
import * as T from '../../types';
import { find, mapPath } from '../../utils';

export interface KonvaShapeAttrs {
  x: number;
  y: number;
}

export interface KonvaRectAttrs extends KonvaShapeAttrs {
  height: number;
  width: number;
}

export interface KonvaCircleAttrs extends KonvaShapeAttrs {
  radius: number;
}

export interface KonvaModelData {
  Shape: { class: Konva.Shape; attrs: KonvaShapeAttrs };
  Rect: { class: Konva.Shape; attrs: KonvaRectAttrs };
  Circle: { class: Konva.Shape; attrs: KonvaCircleAttrs };
}

export type KonvaModelKind = keyof KonvaModelData;

export interface SerializedKonvaModel<
  K extends KonvaModelKind = KonvaModelKind
> {
  className: K;
  attrs: KonvaModelData[K]['attrs'];
}

export type KonvaModel<
  K extends KonvaModelKind = KonvaModelKind
> = KonvaModelData[K]['class'] & {
  lastTextureHash?: string;
};

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

const shapeModelFields: KonvaModelField<'Shape'>[] = [
  {
    label: 'Offset',
    key: 'offset',
    kind: 'Vec2',
    defaultValue: { x: 0, y: 0 },
    props: { precision: 1 },
    getter: (model: Konva.Shape) => ({ x: model.x() || 0, y: model.y() || 0 }),
    serialGetter: (model: SerializedKonvaModel<'Shape'>) => ({
      x: model.attrs.x || 0,
      y: model.attrs.y || 0,
    }),
    setter: (model: Konva.Shape, offset: Vec2) => model.setPosition(offset),
    serialSetter: (model: SerializedKonvaModel<'Shape'>, offset: Vec2) =>
      mapPath(['attrs'], attrs => ({ ...attrs, ...offset }), model),
  } as KonvaModelField<'Shape', 'Vec2'>,
];

const rectModelFields: KonvaModelField<'Rect'>[] = [
  ...(shapeModelFields as any),
  {
    label: 'Dimensions',
    key: 'dimensions',
    kind: 'Vec2',
    defaultValue: { x: 0, y: 0 },
    props: { precision: 1 },
    getter: (model: Konva.Rect) => ({
      x: model.width() || 0,
      y: model.height() || 0,
    }),
    serialGetter: (model: SerializedKonvaModel<'Rect'>) => ({
      x: model.attrs.width || 0,
      y: model.attrs.height || 0,
    }),
    setter: (model: Konva.Rect, offset: Vec2) =>
      model.width(offset.x).height(offset.y),
    serialSetter: (model: SerializedKonvaModel<'Rect'>, offset: Vec2) =>
      mapPath(
        ['attrs'],
        attrs => ({ ...attrs, width: offset.x, height: offset.y }),
        model,
      ),
  } as KonvaModelField<'Rect', 'Vec2'>,
];

const circleModelFields: KonvaModelField<'Circle'>[] = [
  ...(shapeModelFields as any),
  {
    label: 'Radius',
    kind: 'number',
    key: 'radius',
    defaultValue: 0,
    props: { precision: 1 },
    getter: (model: Konva.Circle) => model.radius(),
    serialGetter: (model: SerializedKonvaModel<'Circle'>) => model.attrs.radius,
    setter: (model: Konva.Circle, radius: number) => model.radius(radius),
    serialSetter: (model: SerializedKonvaModel<'Circle'>, radius: number) =>
      mapPath(['attrs'], attrs => ({ ...attrs, radius }), model),
  } as KonvaModelField<'Circle', 'number'>,
];

const konvaModelFields: { [K in KonvaModelKind]: KonvaModelField<K>[] } = {
  Shape: shapeModelFields,
  Rect: rectModelFields,
  Circle: circleModelFields,
};

export const getKonvaModelFields = <K extends KonvaModelKind>(
  kind: K,
): KonvaModelField<K>[] => konvaModelFields[kind] as KonvaModelField<K>[];

export const findKonvaFieldByKey = <K extends KonvaModelKind>(
  className: K,
  key: string,
): Maybe<KonvaModelField<K>> =>
  find(field => field.key === key, getKonvaModelFields(className));

export const updateSerializedKonvaModel = <K extends KonvaModelKind>(
  model: SerializedKonvaModel<K>,
  key: string,
  value: any,
): SerializedKonvaModel<K> => {
  const field = findKonvaFieldByKey(model.className, key);
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
): SerializedKonvaModel<K> => JSON.parse(node.toJSON());

export const isKonvaModelCached = (node: Konva.Node): boolean =>
  node._isUnderCache;
