import Konva from 'konva';
import * as T from '../../types';
import { defaultTo, mapPath } from '../../utils';
import { baseModelFields, defaultBaseAttrs } from './Base';

export interface KonvaCircleAttrs extends T.KonvaBaseAttrs {
  radius: number;
  drawFromCenter: boolean;
}

export interface KonvaCircleData {
  class: KonvaCircleModel;
  attrs: KonvaCircleAttrs;
}

export const defaultCircleAttrs: KonvaCircleAttrs = {
  ...defaultBaseAttrs,
  radius: 20,
  drawFromCenter: true,
} as const;

export const circleModelFields: readonly T.KonvaModelField<'Circle'>[] = [
  ...baseModelFields,
  {
    label: 'Radius',
    kind: 'number',
    key: 'radius',
    defaultValue: defaultCircleAttrs.radius,
    props: { precision: 1 },
    getter: (model: T.SerializedKonvaModel<'Circle'>) =>
      defaultTo(model.attrs.radius, defaultCircleAttrs.radius),
    setter: (model: T.SerializedKonvaModel<'Circle'>, radius: number) =>
      mapPath(['attrs'], attrs => ({ ...attrs, radius }), model),
  } as T.KonvaModelField<'Circle', 'number'>,
  {
    label: 'Draw from center',
    kind: 'boolean',
    key: 'drawFromCenter',
    defaultValue: true,
    getter: (model: T.SerializedKonvaModel<'Circle'>) =>
      defaultTo(model.attrs.drawFromCenter, defaultCircleAttrs.drawFromCenter),
    setter: (
      model: T.SerializedKonvaModel<'Circle'>,
      drawFromCenter: boolean,
    ) => mapPath(['attrs'], attrs => ({ ...attrs, drawFromCenter }), model),
  } as T.KonvaModelField<'Circle', 'boolean'>,
] as const;

export class KonvaCircleModel extends Konva.Circle {
  attrs: KonvaCircleAttrs;

  constructor(attrs: Partial<KonvaCircleAttrs> = {}) {
    super({ ...defaultCircleAttrs, ...attrs });
    this.attrs = { ...defaultCircleAttrs, ...attrs };

    if (this.attrs.drawFromCenter) {
      this.move;
    }
  }

  updateDrawFromCenter(drawFromCenter: boolean): KonvaCircleModel {
    if (this.attrs.drawFromCenter !== drawFromCenter) {
      const d = drawFromCenter ? -this.radius() : this.radius();
      this.move({ x: d, y: d });
    }

    this.attrs.drawFromCenter = drawFromCenter;
    return this;
  }

  serialize(): T.SerializedKonvaModel<'Circle'> {
    const result = JSON.parse(this.toJSON());
    return { ...result, kind: result.className };
  }
}
