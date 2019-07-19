import * as T from '../../types';

export const ps2Map: Dict<T.ControllerKeyData> = {
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
  lsXP: { name: 'LS Right', inputKind: 'axis', key: 'lsXP' },
  lsXN: { name: 'LS Left', inputKind: 'axis', key: 'lsXN' },
  lsYP: { name: 'LS Down', inputKind: 'axis', key: 'lsYP' },
  lsYN: { name: 'LS Up', inputKind: 'axis', key: 'lsYN' },
  rsXP: { name: 'RS Right', inputKind: 'axis', key: 'rsXP' },
  rsXN: { name: 'RS Left', inputKind: 'axis', key: 'rsXN' },
  rsYP: { name: 'RS Down', inputKind: 'axis', key: 'rsYP' },
  rsYN: { name: 'RS Up', inputKind: 'axis', key: 'rsYN' },
};

export type PS2ControllerClass = T.BaseControllerClass & {
  kind: 'ps2';
};

export type PS2Controller = T.BaseController<PS2ControllerClass>;
