import * as T from '../types';

interface GamepadBinding {
  ls: T.StickBinding;
  rs: T.StickBinding;
  dpad: T.DPadBinding;
  button: T.ButtonInputBinding;
}

const binding: GamepadBinding = {
  button: {
    kind: 'button',
    binding: { index: 3 },
  },
  ls: {
    h: { index: 0, inverted: false },
    v: { index: 1, inverted: false },
    down: { index: 10 },
  },
  rs: {
    h: { index: 5, inverted: false },
    v: { index: 2, inverted: false },
    down: { index: 11 },
  },
  dpad: {
    u: { kind: 'axisValue', binding: { axis: 9, value: -1 } },
    l: { kind: 'axisValue', binding: { axis: 9, value: 0.7142857 } },
    d: { kind: 'axisValue', binding: { axis: 9, value: 0.1428571 } },
    r: { kind: 'axisValue', binding: { axis: 9, value: -0.428571 } },
  },
};

const ids = ['a', 'b', 'c', 'd'];

const bindingList: T.BindingData[] = [
  { id: ids[0], binding: { kind: 'stick', binding: binding.ls } },
  { id: ids[1], binding: { kind: 'stick', binding: binding.rs } },
  { id: ids[2], binding: { kind: 'dpad', binding: binding.dpad } },
  { id: ids[3], binding: { kind: 'button', binding: binding.button } },
];

const leftStick: T.StickComponentConfig = {
  kind: 'stick',
  x: 200,
  y: 200,
  bindingId: ids[0],
  id: ids[0],
};

const rightStick: T.StickComponentConfig = {
  kind: 'stick',
  x: 310,
  y: 200,
  bindingId: ids[1],
  id: ids[1],
};

const dPad: T.DPadComponentConfig = {
  kind: 'dpad',
  x: 50,
  y: 50,
  bindingId: ids[2],
  id: ids[2],
  buttonWidth: 30,
  buttonHeight: 30,
};

const button: T.ButtonComponentConfig = {
  kind: 'button',
  x: 150,
  y: 100,
  bindingId: ids[3],
  id: ids[3],
};

const serializedComponents: T.SerializedComponent[] = [
  leftStick,
  rightStick,
  dPad,
  button,
];

export const testInitialState: T.EditorState = {
  display: {
    bindings: bindingList,
    components: serializedComponents,
  },
};
