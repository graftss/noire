import Konva from 'konva';
import * as T from '../../types';
import { mapPath } from '../../utils';
import { baseModelFields, defaultBaseAttrs } from './Base';

export interface KonvaCircleAttrs extends T.KonvaBaseAttrs {
  radius: number;
}

export interface KonvaCircleData {
  class: Konva.Circle;
  attrs: KonvaCircleAttrs;
}

export const defaultCircleAttrs: KonvaCircleAttrs = {
  ...defaultBaseAttrs,
  radius: 10,
} as const;

export const circleModelFields: readonly T.KonvaModelField<'Circle'>[] = [
  ...baseModelFields,
  {
    label: 'Radius',
    kind: 'number',
    key: 'radius',
    defaultValue: defaultCircleAttrs.radius,
    props: { precision: 1 },
    getter: (model: Konva.Circle) =>
      model.radius() || defaultCircleAttrs.radius,
    serialGetter: (model: T.SerializedKonvaModel<'Circle'>) =>
      model.attrs.radius || defaultCircleAttrs.radius,
    setter: (model: Konva.Circle, radius: number) => model.radius(radius),
    serialSetter: (model: T.SerializedKonvaModel<'Circle'>, radius: number) =>
      mapPath(['attrs'], attrs => ({ ...attrs, radius }), model),
  } as T.KonvaModelField<'Circle', 'number'>,
] as const;
