import Konva from 'konva';
import * as T from './types';
import { ControllerManager } from './input/ControllerManager';
import { Display } from './canvas/display';
import { createEditorApp } from './editor';

// TODO: figure out how to not need this to recompile types.ts when the
// watcher notices that it has changed. googling suggests that to do
// so is more of a hassle than it's worth, so whatever. low priority.
import './types';

export interface NoireConfig {
  width?: number;
  height?: number;
  canvasTarget: HTMLDivElement;
  editorTarget: HTMLElement;
}

export class Noire {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private tLast: number = 0;
  private editorApp: T.EditorApp;
  private display: Display;
  private controllerManager: ControllerManager;

  constructor(private config: NoireConfig) {}

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
    const {
      canvasTarget,
      editorTarget,
      width = 800,
      height = 600,
    } = this.config;

    this.stage = new Konva.Stage({
      width,
      height,
      container: canvasTarget,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.editorApp = createEditorApp(editorTarget);
    const store = this.editorApp.store;
    this.editorApp.render();
    // store.subscribe(() => this.storeListener(store.getState()));

    this.controllerManager = new ControllerManager(store);

    this.display = new Display(this.stage, this.layer, store);

    this.updateLoop(this.tLast);
  }
}

const test = new Noire({
  width: 800,
  height: 300,
  editorTarget: document.getElementById('editor') as HTMLElement,
  canvasTarget: document.getElementById('canvas') as HTMLDivElement,
});

test.init();
