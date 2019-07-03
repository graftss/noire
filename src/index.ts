import Konva from 'konva';

import GamepadManager from './gamepad/GamepadManager';
import GamepadMap, { GamepadBindings } from './map/GamepadMap';
import DualStickDisplay from './display/DualStickDisplay';

const bindings: GamepadBindings = {
  ls: { hAxis: 0, vAxis: 1, downIndex: 10 },
  rs: { hAxis: 5, vAxis: 2, downIndex: 11 },
  dpad: {
    kind: 'axis',
    bindings: {
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
