/* eslint-disable @typescript-eslint/no-unused-vars */

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
  kind: 'static',
  state: {
    name: 'vert',
    defaultInput: {},
    inputMap: {},
    offset: { x: 30, y: 0 },
  },
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
          state: {
            xc: 150,
            yc: 300,
            r: 39,
            R: 55,
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
      {
        filter: {
          kind: 'stickDistort',
          state: {
            xc: 240,
            yc: 298,
            r: 39,
            R: 55,
            leash: 0.7,
            debug: true,
          },
        },
        inputMap: {
          xn: { controllerId, key: 'rsXN' },
          xp: { controllerId, key: 'rsXP' },
          yn: { controllerId, key: 'rsYN' },
          yp: { controllerId, key: 'rsYP' },
        },
      },
    ],
  },
};

const vertProd = clone(vert);
vertProd.graphics.shapes.shape = new Konva.Rect({
  x: 0,
  y: 0,
  width: 437,
  height: 606,
});
(vertProd.filters as any).shape[0].filter.state.debug = false;
(vertProd.filters as any).shape[1].filter.state.debug = false;

const stickGraphics: any = {
  shapes: {
    boundary: serializeNode(new Konva.Circle({ radius: 20 })),
    stick: serializeNode(new Konva.Circle({ radius: 3 })),
  },
  textures: {
    boundary: {
      kind: 'fill',
      state: { fill: 'white', stroke: 'black', strokeWidth: 3 },
    },
    // stick: {
    //   kind: 'fill',
    //   state: {
    //     fill: 'rgba(0,0,0,0)',
    //     stroke: 'rgba(0,0,0,0.2)',
    //     strokeWidth: 1,
    //   },
    // },
    stickDown: {
      kind: 'fill',
      state: {
        fill: 'green',
      },
    },
    stick: {
      kind: 'fill',
      state: { fill: 'red' },
    },
  },
};

const dualSticks = (
  graphics,
  offset: Vec2,
  stickDistance: number,
  boundaryRadius: number,
): [T.SerializedComponent, T.SerializedComponent] => {
  return [
    {
      id: ids[0],
      kind: 'stick',
      graphics,
      state: {
        name: 'left stick',
        defaultInput: {},
        offset,
        boundaryRadius,
        inputMap: {
          // xp: { controllerId, key: 'lsXP' },
          // xn: { controllerId, key: 'lsXN' },
          yn: { controllerId, key: 'lsYN' },
          yp: { controllerId, key: 'lsYP' },
          button: { controllerId, key: 'l3' },
        },
        useDepthScaling: true,
      },
    },
    {
      id: ids[1],
      kind: 'stick',
      graphics,
      state: {
        name: 'right stick',
        defaultInput: {},
        offset: { x: offset.x + stickDistance, y: offset.y },
        boundaryRadius,
        inputMap: {
          xp: { controllerId, key: 'rsXP' },
          xn: { controllerId, key: 'rsXN' },
          yn: { controllerId, key: 'rsYN' },
          yp: { controllerId, key: 'rsYP' },
          button: { controllerId, key: 'r3' },
        },
        useDepthScaling: true,
      },
    },
  ];
};

const [leftStick, rightStick] = dualSticks(
  stickGraphics,
  { x: 180, y: 100 },
  100,
  15,
);

const dPad: T.SerializedComponent = {
  id: ids[2],
  kind: 'dpad',
  graphics: {
    shapes: simpleDPadRects(200, 50, 30, 30),
    textures: simpleDPadTextures(
      { kind: 'fill', state: { fill: 'black' } },
      { kind: 'fill', state: { fill: 'red', stroke: 'black', strokeWidth: 1 } },
    ),
  },
  state: {
    defaultInput: {},
    offset: { x: 0, y: 0 },
    name: 'directional pad',
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
    name: 'my first button',
    inputMap: {
      button: { controllerId, key: 'square' },
    },
    defaultInput: {},
    offset: { x: 0, y: 0 },
  },
};

const staticImage: T.SerializedComponent = {
  id: ids[4],
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
  state: {
    inputMap: {},
    name: 'noire',
    offset: { x: 0, y: 0 },
    defaultInput: {},
  },
};

const components: T.SerializedComponent[] = [
  vert,
  // vertProd,
  // staticImage,
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
    controllers: [ps2Controller1, ps2Controller2, defaultKeyboardController],
    remap: undefined,
  },
  tab: { kind: 'controllers' },
};
