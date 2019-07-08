import * as T from '../types';

const ids = 'qwertyuiopasdfghjklzxcvbnm,';

const c: T.PS2Map = {
  padU: { id: ids[0], kind: 'axisValue', axis: 9, value: -1 },
  padL: { id: ids[1], kind: 'axisValue', axis: 9, value: 0.7142857 },
  padR: { id: ids[2], kind: 'axisValue', axis: 9, value: -0.428571 },
  padD: { id: ids[3], kind: 'axisValue', axis: 9, value: 0.1428571 },
  select: { id: ids[4], kind: 'button', index: 8 },
  start: { id: ids[5], kind: 'button', index: 9 },
  square: { id: ids[6], kind: 'button', index: 3 },
  triangle: { id: ids[7], kind: 'button', index: 2 },
  circle: { id: ids[8], kind: 'button', index: 1 },
  x: { id: ids[9], kind: 'button', index: 0 },
  l1: { id: ids[10], kind: 'button', index: 6 },
  l2: { id: ids[11], kind: 'button', index: 4 },
  l3: { id: ids[12], kind: 'button', index: 10 },
  r1: { id: ids[13], kind: 'button', index: 7 },
  r2: { id: ids[14], kind: 'button', index: 5 },
  r3: { id: ids[15], kind: 'button', index: 11 },
  lsX: { id: ids[16], kind: 'axis', index: 0, inverted: false },
  lsY: { id: ids[17], kind: 'axis', index: 1, inverted: false },
  rsX: { id: ids[18], kind: 'axis', index: 5, inverted: false },
  rsY: { id: ids[19], kind: 'axis', index: 2, inverted: false },
};

const dpad: T.DPadBinding = {
  id: ids[20],
  kind: 'dpad',
  u: c.padU,
  l: c.padL,
  r: c.padR,
  d: c.padD,
};

const ls: T.StickBinding = {
  id: ids[21],
  kind: 'stick',
  x: c.lsX,
  y: c.lsY,
  down: c.l3,
};

const rs: T.StickBinding = {
  id: ids[22],
  kind: 'stick',
  x: c.rsX,
  y: c.rsY,
  down: c.r3,
};

const bindings: T.Binding[] = [c.square, dpad, ls, rs];

const leftStick: T.StickComponentConfig = {
  kind: 'stick',
  x: 200,
  y: 200,
  bindingId: ls.id,
  id: ids[0],
};

const rightStick: T.StickComponentConfig = {
  kind: 'stick',
  x: 310,
  y: 200,
  bindingId: rs.id,
  id: ids[1],
};

const dPad: T.DPadComponentConfig = {
  kind: 'dpad',
  x: 50,
  y: 50,
  bindingId: dpad.id,
  id: ids[2],
  buttonWidth: 30,
  buttonHeight: 30,
};

const button: T.ButtonComponentConfig = {
  kind: 'button',
  x: 150,
  y: 100,
  bindingId: c.square.id,
  id: ids[3],
};

const components: T.SerializedComponent[] = [
  leftStick,
  rightStick,
  dPad,
  button,
];

export const testInitialState: T.EditorState = {
  display: {
    bindings,
    components,
  },
};
