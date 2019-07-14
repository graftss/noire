import * as T from '../types';
import { buttonInputKinds } from '../canvas/component/ButtonComponent';
import { stickInputKinds } from '../canvas/component/StickComponent';
import { dPadInputKinds } from '../canvas/component/DPadComponent';

const ids = 'qwertyuiopasdfghjklzxcvbnm,';

const sourceRef: T.GamepadSourceRef = { kind: 'gamepad', index: 1 };

const c: Partial<T.PS2Map> & Dict<T.Binding> = {
  padU: { sourceRef, kind: 'axisValue', axis: 9, value: -1 },
  padL: { sourceRef, kind: 'axisValue', axis: 9, value: 0.7142857 },
  padR: { sourceRef, kind: 'axisValue', axis: 9, value: -0.428571 },
  padD: { sourceRef, kind: 'axisValue', axis: 9, value: 0.1428571 },
  select: { sourceRef, kind: 'button', index: 8 },
  start: { sourceRef, kind: 'button', index: 9 },
  square: { sourceRef, kind: 'button', index: 3 },
  circle: { sourceRef, kind: 'button', index: 1 },
  x: { sourceRef, kind: 'button', index: 2 },
  l1: { sourceRef, kind: 'button', index: 6 },
  l2: { sourceRef, kind: 'button', index: 4 },
  l3: { sourceRef, kind: 'button', index: 10 },
  r1: { sourceRef, kind: 'button', index: 7 },
  r2: { sourceRef, kind: 'button', index: 5 },
  r3: { sourceRef, kind: 'button', index: 11 },
  lsX: { sourceRef, kind: 'axis', index: 0, inverted: false },
  lsY: { sourceRef, kind: 'axis', index: 1, inverted: false },
  rsX: { sourceRef, kind: 'axis', index: 5, inverted: false },
  rsY: { sourceRef, kind: 'axis', index: 2, inverted: false },
};

const controllers: T.Controller[] = [
  { name: 'Test', id: 'a', kind: 'ps2', map: c },
];

const leftStick: T.SerializedComponent = {
  id: ids[0],
  kind: 'stick',
  state: {},
  inputKinds: stickInputKinds,
};

const rightStick: T.SerializedComponent = {
  id: ids[1],
  kind: 'stick',
  state: {},
  inputKinds: stickInputKinds,
};

const dPad: T.SerializedComponent = {
  id: ids[2],
  kind: 'dpad',
  state: {},
  inputKinds: dPadInputKinds,
};

const button: T.SerializedComponent = {
  id: ids[3],
  kind: 'button',
  state: {
    x: 50,
    y: 50,
    width: 30,
    height: 40,
    fill: 'black',
    pressedFill: 'red',
  },
  inputKinds: { button: 'button' },
};

const components: T.SerializedComponent[] = [
  // leftStick,
  // rightStick,
  // dPad,
  button,
];

export const testInitialState: T.EditorState = {
  display: {
    components,
  },
  input: {
    controllers,
    sourceRefs: [],
  },
};
