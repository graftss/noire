import * as T from './types';
import * as actions from './state/actions';
import * as selectors from './state/selectors';
import { ControllerManager } from './input/ControllerManager';
import { Display } from './display';
import { DisplayEventBus } from './display/events/DisplayEventBus';
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
  private tLast = 0;
  private editorApp: T.EditorApp;
  private display: Display;
  private controllerManager: ControllerManager;

  constructor(private config: NoireConfig) {}

  private updateLoop = (tNext: number): void => {
    const fps = selectors.fps(this.editorApp.store.getState());
    const dt = tNext - this.tLast;

    if (dt > 1000 / fps) {
      this.tLast = tNext;

      const input = this.controllerManager.getInput();
      this.display.update(input, dt);
      this.display.draw();

      this.controllerManager.update();
    }

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
      e => e.keyCode === 27 && store.dispatch(actions.exitPresentationMode()),
    );

    this.updateLoop(0);
  }
}
