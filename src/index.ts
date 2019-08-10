import * as T from './types';
import { ControllerManager } from './input/ControllerManager';
import { Display } from './display';
import { DisplayEventBus } from './display/events/DisplayEventBus';
import { createEditorApp } from './editor';
import { exitPresentationMode } from './state/actions';

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
    const eventBus = new DisplayEventBus();

    this.editorApp = createEditorApp(this.config.editorTarget, eventBus);
    this.editorApp.render();
    const { store } = this.editorApp;

    this.controllerManager = new ControllerManager(store, eventBus);
    this.display = new Display(this.config, store, eventBus);

    window.addEventListener(
      'keydown',
      e => e.keyCode === 27 && store.dispatch(exitPresentationMode()),
    );

    this.updateLoop(0);
  }
}

const test = new Noire({
  width: 500,
  height: 700,
  editorTarget: document.getElementById('editor') as HTMLElement,
  canvasTarget: document.getElementById('canvas') as HTMLDivElement,
});

test.init();
