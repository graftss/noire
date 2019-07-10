import Konva from 'konva';
import { map } from 'ramda';

import * as T from './types';
import { Display } from './canvas/display';
import { createEditorApp } from './editor';
import { NextInputListener } from './input/NextInputListener';
import { stopListening } from './state/actions';
import { applyControllerBindings } from './input/controllers';
import { keyBy } from './utils';

export class Noire {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private tLast: number = 0;
  private editorApp: T.EditorApp;
  private display: Display;
  private nextInputListener: NextInputListener;

  constructor(
    private editorTarget: HTMLElement,
    private canvasTarget: HTMLDivElement,
  ) {
    this.nextInputListener = new NextInputListener();
  }

  private getActiveGamepad(): Gamepad {
    const idx = this.editorApp.store.getState().input.gamepadIndex;
    return navigator.getGamepads()[idx];
  }

  private updateLoop = (tNext: number): void => {
    const dt = tNext - this.tLast;
    this.tLast = tNext;

    const gamepad = this.getActiveGamepad();

    if (gamepad) {
      const cs = this.editorApp.store.getState().input.controllers;
      const input: T.AllInput = map(
        c => applyControllerBindings(gamepad, c),
        keyBy(cs, c => c.id),
      );

      this.display.update(input, dt);
      this.display.draw();

      if (this.nextInputListener.isActive()) {
        this.nextInputListener.update(gamepad);
      }
    }

    requestAnimationFrame(this.updateLoop);
  };

  private storeListener = (state: T.EditorState): void => {
    const store = this.editorApp.store;
    const { remapping } = state.input;

    if (!this.nextInputListener.isActive() && remapping !== undefined) {
      switch (remapping.bindingKind) {
        case 'axis':
          this.nextInputListener.awaitPositiveAxis(binding => {
            console.log('axis', binding);
            store.dispatch(stopListening());
          });
          break;

        case 'button':
          this.nextInputListener.awaitButton(binding => {
            console.log('button', binding);
            store.dispatch(stopListening());
          });
      }
    }
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
    const store = this.editorApp.store;
    store.subscribe(() => this.storeListener(store.getState()));

    this.display = new Display(this.stage, this.layer, store);

    this.editorApp.render();
    this.updateLoop(this.tLast);
  }
}

const test = new Noire(
  document.getElementById('editor'),
  document.getElementById('canvas') as HTMLDivElement,
);

test.init();
