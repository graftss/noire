import Konva from 'konva';

import GamepadManager from './gamepad/GamepadManager';
import GamepadMap from './map/GamepadMap';
import DualStickDisplay from './display/DualStickDisplay';

const bindings = {
  ls: { h: 0, v: 1, down: 10 },
  rs: { h: 5, v: 2, down: 11 },
};
const config = { deadzone: 0.01 };

const stage = new Konva.Stage({
  width: 800,
  height: 600,
  container: 'canvas',
});

const analogConfig = {
  leftPos: { x: 200, y: 200 },
  rightPos: { x: 310, y: 200 },
  boundaryR: 40,
  stickR: 26,
};

const gamepadManager = new GamepadManager('gamepads');
const map = new GamepadMap(bindings, config);
const visualizer = new DualStickDisplay(stage, analogConfig);

let t0 = 0;

const update = (t1) => {
  const dt = t1 - t0;
  t0 = t1;

  const input = map.getInput(gamepadManager.getActiveGamepad());

  if (input) visualizer.update(input, dt);

  requestAnimationFrame(update);
};

update(t0);
