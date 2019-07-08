import Konva from 'konva';

import * as T from './types';
import { Display } from './canvas/display';
import { createEditorApp } from './editor';

export class Noire {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private tLast: number = 0;
  private editorApp: T.EditorApp;
  private display: Display;

  constructor(
    private editorTarget: HTMLElement,
    private canvasTarget: HTMLDivElement,
  ) {}

  private getActiveGamepad(): Gamepad {
    const idx = this.editorApp.store.getState().input.gamepadIndex;
    return navigator.getGamepads()[idx];
  }

  updateLoop = (tNext: number): void => {
    const dt = tNext - this.tLast;
    this.tLast = tNext;

    const gamepad = this.getActiveGamepad();

    if (gamepad) {
      this.display.update(gamepad, dt);
      this.display.draw();
    }

    requestAnimationFrame(this.updateLoop);
  };

  init(): void {
    this.stage = new Konva.Stage({
      width: 800,
      height: 600,
      container: this.canvasTarget,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.editorApp = createEditorApp(this.editorTarget);
    this.display = new Display(this.stage, this.layer, this.editorApp.store);

    this.editorApp.render();
    this.updateLoop(this.tLast);
  }
}

const test = new Noire(
  document.getElementById('editor'),
  document.getElementById('canvas') as HTMLDivElement,
);

test.init();
