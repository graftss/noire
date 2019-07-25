import Konva from 'konva';
import * as T from '../types';
import { stickInputKinds } from '../canvas/component/StickComponent';
import { dPadInputKinds } from '../canvas/component/DPadComponent';
import { defaultKeyboardController } from '../input/controller/keyboard';

const ids = 'qwertyuiopasdfghjklzxcvbnm,';

const ref: T.GamepadSourceRef = { kind: 'gamepad', index: 1 };
const sourceKind = 'gamepad';
const controllerId = 'test';

const serializeNode = (node: Konva.Node): object => JSON.parse(node.toJSON());

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

const toAxis = (index, inverted): T.GamepadAxisBinding => ({
  ref,
  sourceKind,
  inputKind: 'axis',
  kind: 'axis',
  index,
  inverted,
});

const b = {
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
  lsXP: toAxis(0, false),
  lsXN: toAxis(0, true),
  lsYP: toAxis(1, false),
  lsYN: toAxis(1, true),
  rsXP: toAxis(5, false),
  rsXN: toAxis(5, true),
  rsYP: toAxis(2, false),
  rsYN: toAxis(2, true),
};

const ps2Controller1: T.PS2Controller = {
  id: controllerId,
  name: 'test controller',
  kind: 'ps2',
  bindings: b,
};

const ps2Controller2: T.PS2Controller = {
  id: 'test 2',
  name: 'other test controller',
  kind: 'ps2',
  bindings: {},
};

const leftStick: T.SerializedComponent = {
  id: ids[0],
  name: 'left stick',
  kind: 'stick',
  graphics: {
    shapes: {
      center: serializeNode(new Konva.Circle({ radius: 20 })),
      stick: serializeNode(new Konva.Circle({ radius: 35 })),
    },
    textures: {
      center: {
        kind: 'fill',
        state: { fill: 'white', stroke: 'black', strokeWidth: 2 },
      },
      stick: {
        kind: 'fill',
        state: { fill: 'black', stroke: '#454545', strokeWidth: 1 },
      },
      stickDown: {
        kind: 'image',
        state: { src: 'dist/noire.png', offset: { x: 200, y: 100 } },
      },
    },
  },
  state: {
    leashScale: 0.5,
    boundaryRadius: 30,
    center: { x: 100, y: 100 },
    inputMap: {
      xp: { controllerId, key: 'lsXP' },
      xn: { controllerId, key: 'lsXN' },
      yn: { controllerId, key: 'lsYN' },
      yp: { controllerId, key: 'lsYP' },
      button: { controllerId, key: 'l3' },
    },
    useDepthScaling: true,
  },
  inputKinds: stickInputKinds,
};

// const rightStick: T.SerializedComponent = {
//   id: ids[1],
//   name: 'right stick',
//   kind: 'stick',
//   graphics: { shapes: {}, textures: {} },
//   state: {
//     x: 300,
//     y: 200,
//     inputMap: {},
//   },
//   inputKinds: stickInputKinds,
// };

const dPad: T.SerializedComponent = {
  id: ids[2],
  name: 'directional pad',
  kind: 'dpad',
  graphics: { shapes: {}, textures: {} },
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
  graphics: {
    shapes: {
      on: serializeNode(
        new Konva.Rect({ x: 50, y: 50, width: 30, height: 30 }),
      ),
      off: serializeNode(
        new Konva.Rect({ x: 150, y: 50, width: 30, height: 30 }),
      ),
    },
    textures: {
      on: {
        kind: 'fill',
        state: { fill: 'green', strokeWidth: 1, stroke: 'black' },
      },
      off: {
        kind: 'image',
        state: { src: 'dist/noire.png', offset: { x: 200, y: 100 } },
      },
    },
  },
  state: {
    inputMap: {
      button: { controllerId, key: 'square' },
    },
  },
  inputKinds: { button: 'button' },
};

const components: T.SerializedComponent[] = [
  leftStick,
  // rightStick,
  // dPad,
  button,
];

export const testInitialState: T.EditorState = {
  display: {
    components,
  },
  input: {
    controller: {
      all: [ps2Controller1, ps2Controller2, defaultKeyboardController],
    },
    remap: undefined,
  },
};
