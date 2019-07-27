/* eslint-disable */

import Konva from 'konva';
import { clone } from 'ramda';
import * as T from '../types';
import { stickInputKinds } from '../canvas/component/StickComponent';
import {
  dPadInputKinds,
  simpleDPadRects,
  simpleDPadTextures,
} from '../canvas/component/DPadComponent';
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

const vert: T.SerializedComponent = {
  id: ids[7],
  name: 'vert',
  kind: 'static',
  graphics: {
    shapes: {
      shape: serializeNode(
        new Konva.Rect({ x: 0, y: 0, width: 437, height: 606 }),
      ),
    },
    textures: {
      texture: {
        kind: 'image',
        state: { src: 'dist/vert.png', offset: { x: 0, y: 0 } },
      },
    },
  },
  filters: {
    shape: [
      {
        filter: {
          kind: 'stickDistort',
          config: {
            xc: 150,
            yc: 300,
            r: 39,
            R: 53,
            leash: 0.7,
            debug: true,
          },
        },
        inputMap: {
          xn: { controllerId, key: 'lsXN' },
          xp: { controllerId, key: 'lsXP' },
          yn: { controllerId, key: 'lsYN' },
          yp: { controllerId, key: 'lsYP' },
        },
      },
      // {
      //   filter: {
      //     kind: 'stickDistort',
      //     config: {
      //       xc: 250,
      //       yc: 300,
      //       r: 39,
      //       R: 53,
      //       leash: 0.7,
      //       debug: true,
      //     },
      //   },
      //   inputMap: {
      //     xn: { controllerId, key: 'rsXN' },
      //     xp: { controllerId, key: 'rsXP' },
      //     yn: { controllerId, key: 'rsYN' },
      //     yp: { controllerId, key: 'rsYP' },
      //   },
      // },
      {
        filter: {
          kind: 'dPadDistort',
          config: {
            xc: 250,
            yc: 300,
            r: 39,
            R: 53,
            leash: 0.7,
            debug: true,
          },
        },
        inputMap: {
          l: { controllerId, key: 'padL' },
          r: { controllerId, key: 'padR' },
          u: { controllerId, key: 'padU' },
          d: { controllerId, key: 'padD' },
        },
      },
    ],
  },
};

const leftStick: T.SerializedComponent = {
  id: ids[0],
  name: 'left stick',
  kind: 'stick',
  graphics: {
    shapes: {
      center: serializeNode(new Konva.Circle({ radius: 20 })),
      stick: serializeNode(new Konva.Circle({ radius: 80 })),
    },
    textures: {
      center: {
        kind: 'fill',
        state: { fill: 'white', stroke: 'black', strokeWidth: 2 },
      },
      stick: {
        kind: 'image',
        state: { src: 'dist/noire.png', offset: { x: 250, y: 700 } },
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
    center: { x: 250, y: 700 },
    inputMap: {
      xp: { controllerId, key: 'lsXP' },
      xn: { controllerId, key: 'lsXN' },
      yn: { controllerId, key: 'lsYN' },
      yp: { controllerId, key: 'lsYP' },
      button: { controllerId, key: 'l3' },
    },
    useDepthScaling: true,
  },
};

const rightStick: T.SerializedComponent = {
  id: ids[0],
  name: 'right stick',
  kind: 'stick',
  graphics: {
    shapes: {
      center: serializeNode(new Konva.Circle({ radius: 20 })),
      stick: serializeNode(new Konva.Circle({ radius: 80 })),
    },
    textures: {
      center: {
        kind: 'fill',
        state: { fill: 'white', stroke: 'black', strokeWidth: 2 },
      },
      stickDown: {
        kind: 'fill',
        state: { fill: 'black' },
      },
      stick: {
        kind: 'image',
        state: { src: 'dist/noire.png', offset: { x: 420, y: 710 } },
      },
    },
  },
  state: {
    leashScale: 0.5,
    boundaryRadius: 30,
    center: { x: 420, y: 710 },
    inputMap: {
      xp: { controllerId, key: 'rsXP' },
      xn: { controllerId, key: 'rsXN' },
      yn: { controllerId, key: 'rsYN' },
      yp: { controllerId, key: 'rsYP' },
      button: { controllerId, key: 'r3' },
    },
    useDepthScaling: true,
  },
};

const dPad: T.SerializedComponent = {
  id: ids[2],
  name: 'directional pad',
  kind: 'dpad',
  graphics: {
    shapes: simpleDPadRects(200, 50, 30, 30),
    textures: simpleDPadTextures(
      { kind: 'fill', state: { fill: 'black' } },
      { kind: 'fill', state: { fill: 'red', stroke: 'black', strokeWidth: 1 } },
    ),
  },
  state: {
    inputMap: {
      d: { controllerId, key: 'padD' },
      u: { controllerId, key: 'padU' },
      l: { controllerId, key: 'padL' },
      r: { controllerId, key: 'padR' },
    },
  },
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
        state: {
          src: 'dist/noire.png',
          offset: { x: 200, y: 100 },
        },
      },
    },
  },
  state: {
    inputMap: {
      button: { controllerId, key: 'square' },
    },
  },
};

const staticImage: T.SerializedComponent = {
  id: ids[4],
  name: 'static',
  kind: 'static',
  graphics: {
    shapes: {
      shape: serializeNode(
        new Konva.Rect({ x: 0, y: 0, width: 675, height: 1000 }),
      ),
    },
    textures: {
      texture: {
        kind: 'image',
        state: { src: 'dist/noire.png', offset: { x: 0, y: 0 } },
      },
    },
  },
  state: { inputMap: {} },
};

const components: T.SerializedComponent[] = [
  // vert,
  // vertProd,
  // staticImage,
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
      all: [ps2Controller1, ps2Controller2, defaultKeyboardController],
    },
    remap: undefined,
  },
};
