import * as T from '../types';

const ids = 'qwertyuiopasdfghjklzxcvbnm,';

const c: T.PS2Map & Record<string, T.Binding> = {
  padU: { id: ids[0], kind: 'axisValue', axis: 9, value: -1 },
  padL: { id: ids[1], kind: 'axisValue', axis: 9, value: 0.7142857 },
  padR: { id: ids[2], kind: 'axisValue', axis: 9, value: -0.428571 },
  padD: { id: ids[3], kind: 'axisValue', axis: 9, value: 0.1428571 },
  select: { id: ids[4], kind: 'button', index: 8 },
  start: { id: ids[5], kind: 'button', index: 9 },
  square: { id: ids[6], kind: 'button', index: 3 },
  triangle: { id: ids[7], kind: 'button', index: 0 },
  circle: { id: ids[8], kind: 'button', index: 1 },
  x: { id: ids[9], kind: 'button', index: 2 },
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

const controllers: T.Controller[] = [{ id: 'a', kind: 'ps2', map: c }];

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
    bindings: [],
    components,
  },
  input: {
    controllers,
  },
};
