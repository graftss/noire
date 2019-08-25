import Konva from 'konva';
import * as T from '../../types';
import { mapPath } from '../../utils';
import { baseModelFields, defaultBaseAttrs } from './Base';

export interface KonvaRectAttrs extends T.KonvaBaseAttrs {
  height: number;
  width: number;
}

export interface KonvaRectData {
  class: Konva.Rect;
  attrs: KonvaRectAttrs;
}

export const defaultRectAttrs: KonvaRectAttrs = {
  ...defaultBaseAttrs,
  height: 40,
  width: 40,
} as const;

export const rectModelFields: readonly T.KonvaModelField<'Rect'>[] = [
  ...baseModelFields,
  {
    label: 'Dimensions',
    key: 'dimensions',
    kind: 'Vec2',
    defaultValue: { x: defaultRectAttrs.height, y: defaultRectAttrs.width },
    props: { precision: 1 },
    getter: (model: T.SerializedKonvaModel<'Rect'>) => ({
      x: model.attrs.width || defaultRectAttrs.height,
      y: model.attrs.height || defaultRectAttrs.width,
    }),
    setter: (model: T.SerializedKonvaModel<'Rect'>, dims: Vec2) =>
      mapPath(
        ['attrs'],
        attrs => ({ ...attrs, width: dims.x, height: dims.y }),
        model,
      ),
  } as T.KonvaModelField<'Rect', 'Vec2'>,
] as const;
