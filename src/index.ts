import Konva from 'konva';

import { GamepadManager } from './canvas/gamepad/GamepadManager';
import { Display } from './canvas/display';
import { createEditorApp } from './editor';

const stage = new Konva.Stage({
  width: 800,
  height: 600,
  container: 'canvas',
});

const layer = new Konva.Layer();
stage.add(layer);

let t0 = 0;

const editorApp = createEditorApp(document.getElementById('editor'));
editorApp.render();

const gamepadManager = new GamepadManager('gamepads');
const display = new Display(stage, layer, editorApp.store);

const update = (t1): void => {
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
