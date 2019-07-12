import * as T from '../types';

const ids = 'qwertyuiopasdfghjklzxcvbnm,';

const source: T.GamepadSource = { kind: 'gamepad', index: 1 };

const c: T.PS2Map & Record<string, T.Binding> = {
  padU: { source, id: ids[0], kind: 'axisValue', axis: 9, value: -1 },
  padL: { source, id: ids[1], kind: 'axisValue', axis: 9, value: 0.7142857 },
  padR: { source, id: ids[2], kind: 'axisValue', axis: 9, value: -0.428571 },
  padD: { source, id: ids[3], kind: 'axisValue', axis: 9, value: 0.1428571 },
  select: { source, id: ids[4], kind: 'button', index: 8 },
  start: { source, id: ids[5], kind: 'button', index: 9 },
  square: { source, id: ids[6], kind: 'button', index: 3 },
  triangle: { source, id: ids[7], kind: 'button', index: 0 },
  circle: { source, id: ids[8], kind: 'button', index: 1 },
  x: { source, id: ids[9], kind: 'button', index: 2 },
  l1: { source, id: ids[10], kind: 'button', index: 6 },
  l2: { source, id: ids[11], kind: 'button', index: 4 },
  l3: { source, id: ids[12], kind: 'button', index: 10 },
  r1: { source, id: ids[13], kind: 'button', index: 7 },
  r2: { source, id: ids[14], kind: 'button', index: 5 },
  r3: { source, id: ids[15], kind: 'button', index: 11 },
  lsX: { source, id: ids[16], kind: 'axis', index: 0, inverted: false },
  lsY: { source, id: ids[17], kind: 'axis', index: 1, inverted: false },
  rsX: { source, id: ids[18], kind: 'axis', index: 5, inverted: false },
  rsY: { source, id: ids[19], kind: 'axis', index: 2, inverted: false },
};

const controllers: T.Controller[] = [
  { name: 'test', id: 'a', kind: 'ps2', map: c },
];

const leftStick: T.StickComponentConfig = {
  kind: 'stick',
  x: 200,
  y: 200,
  id: ids[0],
  inputMap: {
    x: { controllerId: 'a', key: 'lsX' },
    y: { controllerId: 'a', key: 'lsY' },
    button: { controllerId: 'a', key: 'l3' },
  },
};

const rightStick: T.StickComponentConfig = {
  kind: 'stick',
  x: 310,
  y: 200,
  id: ids[1],
  inputMap: {
    x: { controllerId: 'a', key: 'rsX' },
    y: { controllerId: 'a', key: 'rsY' },
    button: { controllerId: 'a', key: 'r3' },
  },
};

const dPad: T.DPadComponentConfig = {
  kind: 'dpad',
  x: 50,
  y: 50,
  id: ids[2],
  buttonWidth: 30,
  buttonHeight: 30,
  inputMap: {
    u: { controllerId: 'a', key: 'padU' },
    l: { controllerId: 'a', key: 'padL' },
    d: { controllerId: 'a', key: 'padD' },
    r: { controllerId: 'a', key: 'padR' },
  },
};

const button: T.ButtonComponentConfig = {
  kind: 'button',
  x: 150,
  y: 100,
  id: ids[3],
  inputMap: { button: { controllerId: 'a', key: 'triangle' } },
};

const components: T.SerializedComponent[] = [
  leftStick,
  rightStick,
  dPad,
  button,
];

export const testInitialState: T.EditorState = {
  display: {
    components,
  },
  input: {
    controllers,
  },
};
