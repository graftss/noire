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

export type ControllerKeyBinding = [
  keyof ControllerMap,
  T.BindingId,
  T.SimpleBindingKind,
  string,
];

const simpleControllerKey = (
  c: Controller,
  b: T.SimpleBinding,
  inputKind: T.SimpleBindingKind,
  inputKey: string,
): ControllerKeyBinding | undefined => {
  if (!c || !b) return;

  for (let key in c.map) {
    if (c.map[key].id === b.id) {
      return [key as keyof ControllerMap, b.id, inputKind, inputKey];
    }
  }
};

export const controllerKey = (
  c: Controller,
  b: T.Binding,
): ControllerKeyBinding[] => {
  if (!c || !b) return;

  switch (b.kind) {
    case 'button':
    case 'axis':
      return [simpleControllerKey(c, b, b.kind, null)];

    case 'stick':
      return [
        simpleControllerKey(c, b.x, 'axis', 'x'),
        simpleControllerKey(c, b.y, 'axis', 'y'),
        simpleControllerKey(c, b.down, 'button', 'down'),
      ];

    case 'dpad':
      return [
        simpleControllerKey(c, b.u, 'button', 'u'),
        simpleControllerKey(c, b.l, 'button', 'l'),
        simpleControllerKey(c, b.d, 'button', 'd'),
        simpleControllerKey(c, b.r, 'button', 'r'),
      ];
  }
};
