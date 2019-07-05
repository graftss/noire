import Konva from 'konva';

import GamepadManager from './gamepad/GamepadManager';
import TestDisplay from './test/TestDisplay';


const config = { deadzone: 0.01 };

const stage = new Konva.Stage({
  width: 800,
  height: 600,
  container: 'canvas',
});

const layer = new Konva.Layer();
stage.add(layer);

const gamepadManager = new GamepadManager('gamepads');
const display = new TestDisplay(stage, layer);

let t0 = 0;

const update = (t1) => {
  const dt = t1 - t0;
  t0 = t1;

  const gamepad = gamepadManager.getActiveGamepad();

  if (gamepad) {
    display.update(gamepad, dt);
    display.draw();
  }

  requestAnimationFrame(update);
};

update(t0);
