import * as T from '../types';

export interface KeyData {
  name: string;
  inputKind: T.InputKind;
}

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

const ps2KeyData: Record<keyof PS2Map, KeyData> = {
  padU: { name: 'D-Pad Up', inputKind: 'button' },
  padL: { name: 'D-Pad Left', inputKind: 'button' },
  padD: { name: 'D-Pad Down', inputKind: 'button' },
  padR: { name: 'D-Pad Right', inputKind: 'button' },
  select: { name: 'Select', inputKind: 'button' },
  start: { name: 'Start', inputKind: 'button' },
  square: { name: 'Square', inputKind: 'button' },
  triangle: { name: 'Triangle', inputKind: 'button' },
  circle: { name: 'Circle', inputKind: 'button' },
  x: { name: 'X', inputKind: 'button' },
  l1: { name: 'L1', inputKind: 'button' },
  l2: { name: 'L2', inputKind: 'button' },
  l3: { name: 'L3', inputKind: 'button' },
  r1: { name: 'R1', inputKind: 'button' },
  r2: { name: 'R2', inputKind: 'button' },
  r3: { name: 'R3', inputKind: 'button' },
  lsX: { name: 'Left Stick X', inputKind: 'axis' },
  lsY: { name: 'Left Stick Y', inputKind: 'axis' },
  rsX: { name: 'Right Stick X', inputKind: 'axis' },
  rsY: { name: 'Right Stick Y', inputKind: 'axis' },
};

export interface PS2GamepadMap {
  kind: 'ps2';
  map: Partial<PS2Map>;
}

export type GamepadMap = PS2GamepadMap;

export const controllerData: Record<string, Record<string, KeyData>> = {
  ps2: ps2KeyData,
};

export const controllerKeyNames = {
  ps2: Object.keys(ps2KeyData),
};
