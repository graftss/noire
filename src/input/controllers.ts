import * as T from '../types';

export interface PS2Map {
  padU: T.ButtonInputBinding;
  padL: T.ButtonInputBinding;
  padR: T.ButtonInputBinding;
  padD: T.ButtonInputBinding;
  select: T.ButtonInputBinding;
  start: T.ButtonInputBinding;
  square: T.ButtonInputBinding;
  triangle: T.ButtonInputBinding;
  circle: T.ButtonInputBinding;
  x: T.ButtonInputBinding;
  l1: T.ButtonInputBinding;
  l2: T.ButtonInputBinding;
  l3: T.ButtonInputBinding;
  r1: T.ButtonInputBinding;
  r2: T.ButtonInputBinding;
  r3: T.ButtonInputBinding;
  lsX: T.AxisBinding;
  lsY: T.AxisBinding;
  rsX: T.AxisBinding;
  rsY: T.AxisBinding;
}

export interface PS2Controller {
  kind: 'ps2';
  map: PS2Map;
}

export type ControllerMap = PS2Map;

export type Controller = PS2Controller;

export interface ControllerBindingRelation {
  controllerKey: keyof ControllerMap;
  binding: T.SimpleBinding;
  displayName: string;
  parentKey?: string;
  parentId?: T.BindingId;
}

const simpleBindingRelation = (
  c: Controller,
  binding: T.SimpleBinding,
  parentKey?: string,
  parentId?: T.BindingId,
): ControllerBindingRelation | undefined => {
  if (!c || !binding) return;

  for (let key in c.map) {
    if (c.map[key].id === binding.id) {
      return {
        controllerKey: key as keyof ControllerMap,
        binding,
        displayName: parentKey || binding.kind,
        parentKey,
        parentId,
      };
    }
  }
};

export const controllerKey = (
  c: Controller,
  b: T.Binding,
): ControllerBindingRelation[] => {
  if (!c || !b) return;

  switch (b.kind) {
    case 'button':
    case 'axis':
      return [simpleBindingRelation(c, b)];

    case 'stick':
      return [
        simpleBindingRelation(c, b.x, 'x', b.id),
        simpleBindingRelation(c, b.y, 'y', b.id),
        simpleBindingRelation(c, b.down, 'down', b.id),
      ];

    case 'dpad':
      return [
        simpleBindingRelation(c, b.u, 'u', b.id),
        simpleBindingRelation(c, b.l, 'l', b.id),
        simpleBindingRelation(c, b.d, 'd', b.id),
        simpleBindingRelation(c, b.r, 'r', b.id),
      ];
  }
};
