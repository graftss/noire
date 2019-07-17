import * as T from '../../types';

export const PS2Map = {
  padU: { name: 'D-Pad Up', inputKind: 'button', key: 'padU' },
  padL: { name: 'D-Pad Left', inputKind: 'button', key: 'padL' },
  padD: { name: 'D-Pad Down', inputKind: 'button', key: 'padD' },
  padR: { name: 'D-Pad Right', inputKind: 'button', key: 'padR' },
  select: { name: 'Select', inputKind: 'button', key: 'select' },
  start: { name: 'Start', inputKind: 'button', key: 'start' },
  square: { name: 'Square', inputKind: 'button', key: 'square' },
  triangle: { name: 'Triangle', inputKind: 'button', key: 'triangle' },
  circle: { name: 'Circle', inputKind: 'button', key: 'circle' },
  x: { name: 'X', inputKind: 'button', key: 'x' },
  l1: { name: 'L1', inputKind: 'button', key: 'l1' },
  l2: { name: 'L2', inputKind: 'button', key: 'l2' },
  l3: { name: 'L3', inputKind: 'button', key: 'l3' },
  r1: { name: 'R1', inputKind: 'button', key: 'r1' },
  r2: { name: 'R2', inputKind: 'button', key: 'r2' },
  r3: { name: 'R3', inputKind: 'button', key: 'r3' },
  lsX: { name: 'Left Stick X', inputKind: 'axis', key: 'lsX' },
  lsY: { name: 'Left Stick Y', inputKind: 'axis', key: 'lsY' },
  rsX: { name: 'Right Stick X', inputKind: 'axis', key: 'rsX' },
  rsY: { name: 'Right Stick Y', inputKind: 'axis', key: 'rsY' },
};

export type PS2Controller = T.BaseController & {
  kind: 'ps2';
  map: typeof PS2Map;
  sourceKind: 'gamepad';
};

export type PS2Bindings = T.BaseControllerBindings<PS2Controller>;
