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
  private componentData: T.ComponentData[];
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
    this.eventBus = new DisplayEventBus(stage, this.cm);

    this.syncWithStore();

    this.cm = new ComponentManager(
      stage,
      layer,
      this.eventBus,
      this.componentData,
    );

    this.plugins = [new ComponentTransformerPlugin(this.eventBus)];
  }

  syncWithStore(): void {
    const state = this.editorApp.store.getState();
    this.bindingData = state.display.bindings;
    this.componentData = state.display.components.map(deserializeComponent);
  }

  addComponent(component, bindingId?: T.BindingId): void {
    this.cm.add({ component, bindingId });
  }

  // removeComponent(component: Component<any>) {
  //   this.cm.remove(component);
  // }

  draw(): void {
    this.layer.draw();
  }

  getInputDict(gamepad: Gamepad): { [id: number]: T.Input } {
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
