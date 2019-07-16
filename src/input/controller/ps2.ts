import * as T from '../../types';

export type PS2Map = Dict<T.ControllerKey> & {
  padU: { name: 'D-Pad Up'; inputKind: 'button' };
  padL: { name: 'D-Pad Left'; inputKind: 'button' };
  padD: { name: 'D-Pad Down'; inputKind: 'button' };
  padR: { name: 'D-Pad Right'; inputKind: 'button' };
  select: { name: 'Select'; inputKind: 'button' };
  start: { name: 'Start'; inputKind: 'button' };
  square: { name: 'Square'; inputKind: 'button' };
  triangle: { name: 'Triangle'; inputKind: 'button' };
  circle: { name: 'Circle'; inputKind: 'button' };
  x: { name: 'X'; inputKind: 'button' };
  l1: { name: 'L1'; inputKind: 'button' };
  l2: { name: 'L2'; inputKind: 'button' };
  l3: { name: 'L3'; inputKind: 'button' };
  r1: { name: 'R1'; inputKind: 'button' };
  r2: { name: 'R2'; inputKind: 'button' };
  r3: { name: 'R3'; inputKind: 'button' };
  lsX: { name: 'Left Stick X'; inputKind: 'axis' };
  lsY: { name: 'Left Stick Y'; inputKind: 'axis' };
  rsX: { name: 'Right Stick X'; inputKind: 'axis' };
  rsY: { name: 'Right Stick Y'; inputKind: 'axis' };
};

export interface PS2Controller {
  kind: 'ps2';
  map: PS2Map;
  sourceKind: 'gamepad';
}

export type PS2Bindings = T.BaseControllerBindings<PS2Controller>;
