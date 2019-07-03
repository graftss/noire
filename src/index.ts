import Konva from 'konva';

import GamepadManager from './gamepad/GamepadManager';
import GamepadMap, { GamepadBinding } from './test/GamepadMap';
import TestDisplay from './test/TestDisplay';
import NextInputListener from './gamepad/NextInputListener';

const binding: GamepadBinding = {
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
    kind: 'axis',
    binding: {
      u: { axis: 9, value: -1 },
      l: { axis: 9, value: 0.7142857 },
      d: { axis: 9, value: 0.1428571 },
      r: { axis: 9, value: -0.428571 },
    },
  }
};

const config = { deadzone: 0.01 };

const stage = new Konva.Stage({
  width: 800,
  height: 600,
  container: 'canvas',
});

const layer = new Konva.Layer();
stage.add(layer);

const analogConfig = {
  leftPos: { x: 200, y: 200 },
  rightPos: { x: 310, y: 200 },
  boundaryR: 40,
  stickR: 26,
};

const gamepadManager = new GamepadManager('gamepads');
const map = new GamepadMap(binding, config);
const display = new TestDisplay(stage, layer, analogConfig);
const nextInputListener = new NextInputListener();

let t0 = 0;

nextInputListener.awaitPositiveAxis((binding) => {
  console.log('hi', binding);
});

const update = (t1) => {
  const dt = t1 - t0;
  t0 = t1;

  const gamepad = gamepadManager.getActiveGamepad();

  const input = map.getInput(gamepad);

  if (input) {
    nextInputListener.update(gamepad);
    display.update(input, dt);
    display.draw();
  }

  requestAnimationFrame(update);
};

update(t0);
