import Konva from 'konva';

import * as T from '../types';
import { applyBinding } from './BindingManager';
import { ComponentManager } from './ComponentManager';
// import { ComponentEditorPlugin } from './plugin/ComponentEditorPlugin';
import { ComponentTransformerPlugin } from './plugin/ComponentTransformerPlugin';
import { DisplayEventBus } from './DisplayEventBus';
import { DisplayPlugin } from './plugin/DisplayPlugin';
import { NextInputListener } from './NextInputListener';
import { EditorApp } from '../../editor';
import { deserializeComponent } from '../component/deserializeComponent';

export class Display {
  private bindingData: T.BindingData[];
  private nextInputListener: NextInputListener;
  private eventBus: DisplayEventBus;
  private cm: ComponentManager;

  private plugins: DisplayPlugin[];

  constructor(
    private stage: Konva.Stage,
    private layer: Konva.Layer,
    private editorApp: EditorApp,
  ) {
    this.stage = stage;
    this.layer = layer;
    this.nextInputListener = new NextInputListener();
    this.eventBus = new DisplayEventBus(stage);
    this.plugins = [new ComponentTransformerPlugin(this.eventBus)];

    this.cm = new ComponentManager(stage, layer, this.eventBus);
    this.syncWithStore();
  }

  syncWithStore(): void {
    const { display } = this.editorApp.store.getState();

    this.bindingData = display.bindings;
    this.cm.reset(display.components.map(deserializeComponent));
  }

  draw(): void {
    this.layer.draw();
  }

  getInputDict(gamepad: Gamepad): Record<T.BindingId, T.Input> {
    const result = {};

    this.bindingData.forEach(
      ({ id, binding }) => (result[id] = applyBinding(binding, gamepad)),
    );

    return result;
  }

  update(gamepad: Gamepad, dt: number): void {
    if (this.nextInputListener.isActive()) {
      this.nextInputListener.update(gamepad);
    }

    const inputDict = this.getInputDict(gamepad);
    this.cm.update(inputDict, dt);
  }
}
