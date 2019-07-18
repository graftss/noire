import * as T from '../types';
import { stickInputKinds } from '../canvas/component/StickComponent';
import { dPadInputKinds } from '../canvas/component/DPadComponent';

const ids = 'qwertyuiopasdfghjklzxcvbnm,';

const ref: T.GamepadSourceRef = { kind: 'gamepad', index: 1 };
const sourceKind = 'gamepad';
const controllerId = 'test';

const toAxisValue = (axis, value): T.GamepadAxisValueBinding => ({
  ref,
  sourceKind,
  inputKind: 'button',
  kind: 'axisValue',
  axis,
  value,
});

const toButton = (index): T.GamepadButtonBinding => ({
  ref,
  sourceKind,
  inputKind: 'button',
  kind: 'button',
  index,
});

const toAxis = (index): T.GamepadAxisBinding => ({
  ref,
  sourceKind,
  inputKind: 'axis',
  kind: 'axis',
  index,
  inverted: false,
});

const b: Dict<T.GamepadBinding> = {
  padU: toAxisValue(9, -1),
  padL: toAxisValue(9, 0.7142857),
  padR: toAxisValue(9, -0.428571),
  padD: toAxisValue(9, 0.1428571),
  select: toButton(8),
  start: toButton(9),
  square: toButton(3),
  circle: toButton(1),
  triangle: toButton(0),
  x: toButton(2),
  l1: toButton(6),
  l2: toButton(4),
  l3: toButton(10),
  r1: toButton(7),
  r2: toButton(5),
  r3: toButton(11),
  lsX: toAxis(0),
  lsY: toAxis(1),
  rsX: toAxis(5),
  rsY: toAxis(2),
};

const ps2Controller1: T.PS2Controller = {
  id: controllerId,
  name: 'test controller',
  controllerKind: 'ps2',
  sourceKind: 'gamepad',
  bindings: b,
};

const ps2Controller2: T.PS2Controller = {
  id: 'test 2',
  name: 'other test controller',
  controllerKind: 'ps2',
  sourceKind: 'gamepad',
  bindings: {},
};

const leftStick: T.SerializedComponent = {
  id: ids[0],
  name: 'left stick',
  kind: 'stick',
  state: {
    inputMap: {},
  },
  inputKinds: stickInputKinds,
};

const rightStick: T.SerializedComponent = {
  id: ids[1],
  name: 'right stick',
  kind: 'stick',
  state: {
    x: 300,
    y: 200,
    inputMap: {
      x: { controllerId, key: 'lsX' },
      y: { controllerId, key: 'lsY' },
    },
  },
  inputKinds: stickInputKinds,
};

const dPad: T.SerializedComponent = {
  id: ids[2],
  name: 'directional pad',
  kind: 'dpad',
  state: {
    x: 150,
    y: 150,
    pressedFill: 'blue',
    inputMap: {
      d: { controllerId, key: 'triangle' },
      u: { controllerId, key: 'padU' },
    },
  },
  inputKinds: dPadInputKinds,
};

const button: T.SerializedComponent = {
  id: ids[3],
  name: 'my first button',
  kind: 'button',
  state: {
    x: 50,
    y: 50,
    width: 30,
    height: 40,
    fill: 'black',
    pressedFill: 'red',
    inputMap: {
      button: { controllerId, key: 'square' },
    },
  },
  inputKinds: { button: 'button' },
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
    controller: {
      all: [ps2Controller1, ps2Controller2],
    },
  },
};
