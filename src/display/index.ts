import Konva from 'konva';

import BindingManager, { BindingData, BindingId } from './BindingManager';
import Component from '../component';
import ComponentManager, { ComponentData } from './ComponentManager';
import ComponentEditorPlugin from './plugin/ComponentEditorPlugin';
import ComponentTransformerPlugin from './plugin/ComponentTransformerPlugin';
import DisplayPlugin from './plugin/DisplayPlugin';
import DisplayEventBus from './DisplayEventBus';
import NextInputListener from './NextInputListener';

export default class Display {
  private nextInputListener: NextInputListener;
  private eventBus: DisplayEventBus;
  private bm: BindingManager;
  private cm: ComponentManager;
  private plugins: DisplayPlugin[];

  constructor(
    private stage: Konva.Stage,
    private layer: Konva.Layer,
    private bindingData?: BindingData[],
    private componentData?: ComponentData[],
  ) {
    this.stage = stage;
    this.layer = layer;
    this.nextInputListener = new NextInputListener();
    this.eventBus = new DisplayEventBus(stage, this.cm);
    this.bm = new BindingManager(this.eventBus, bindingData);
    this.cm = new ComponentManager(stage, layer, this.eventBus, componentData);

    this.plugins = [
      new ComponentTransformerPlugin(this.eventBus),
      new ComponentEditorPlugin(
        this.eventBus,
        this.nextInputListener,
        this.bm,
        this.cm,
      ),
    ];
  }

  addComponent(component: Component<any>, bindingId?: BindingId) {
    this.cm.add({ component, bindingId });
  }

  // removeComponent(component: Component<any>) {
  //   this.cm.remove(component);
  // }

  draw() {
    this.layer.draw();
  }

  update(gamepad: Gamepad, dt: number) {
    if (this.nextInputListener.isActive()) {
      this.nextInputListener.update(gamepad);
    }

    const inputDict = this.bm.getInputDict(gamepad);
    this.cm.update(inputDict, dt);
  }
}
