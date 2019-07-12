import Konva from 'konva';

import * as T from './types';
import { ControllerManager } from './input/ControllerManager';
import { Display } from './canvas/display';
import { createEditorApp } from './editor';

export class Noire {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private tLast: number = 0;
  private editorApp: T.EditorApp;
  private display: Display;
  private controllerManager: ControllerManager;

  constructor(
    private editorTarget: HTMLElement,
    private canvasTarget: HTMLDivElement,
  ) {}

  private updateLoop = (tNext: number): void => {
    const dt = tNext - this.tLast;
    this.tLast = tNext;

    const input = this.controllerManager.getInput();
    this.display.update(input, dt);
    this.display.draw();

    this.controllerManager.update();

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
    const store = this.editorApp.store;
    this.editorApp.render();
    // store.subscribe(() => this.storeListener(store.getState()));

    this.controllerManager = new ControllerManager(store);

    this.display = new Display(this.stage, this.layer, store);

    this.updateLoop(this.tLast);
  }

  // private storeListener = (state: T.EditorState): void => {
  //   const store = this.editorApp.store;
  //   const { remapping } = state.input;

  //   if (!this.nextInputListener.isActive() && remapping !== undefined) {
  //     switch (remapping.bindingKind) {
  //       case 'axis':
  //         this.nextInputListener.awaitPositiveAxis(binding => {
  //           console.log('axis', binding);
  //           store.dispatch(stopListening());
  //         });
  //         break;

  //       case 'button':
  //         this.nextInputListener.awaitButton(binding => {
  //           console.log('button', binding);
  //           store.dispatch(stopListening());
  //         });
  //     }
  //   }
  // };
}

const test = new Noire(
  document.getElementById('editor'),
  document.getElementById('canvas') as HTMLDivElement,
);

test.init();
