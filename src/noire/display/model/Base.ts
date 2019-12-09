import * as T from '../../types';
import { mapPath } from '../../utils';

export interface KonvaBaseAttrs {
  x: number;
  y: number;
}

export const defaultBaseAttrs: KonvaBaseAttrs = {
  x: 0,
  y: 0,
};

export const baseModelFields = [
  {
    label: 'Position',
    key: 'position',
    kind: 'Vec2',
    defaultValue: { x: 0, y: 0 },
    props: { precision: 1 },
    getter: (model: T.SerializedKonvaModel<any>) => ({
      x: model.attrs.x || 0,
      y: model.attrs.y || 0,
    }),
    setter: (model: T.SerializedKonvaModel<any>, { x, y }: Vec2) =>
      mapPath(['attrs'], attrs => ({ ...attrs, x, y }), model),
  } as T.KonvaModelField<any, 'Vec2'>,
];
