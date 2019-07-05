import Konva from 'konva';

import BindingManager, { BindingData, BindingId } from '../gamepad/BindingManager';
import Component from '../component';
import ComponentManager from './ComponentManager';
import ComponentTransformerPlugin from './plugin/ComponentTransformerPlugin';
import DisplayPlugin from './plugin/DisplayPlugin';
import DisplayEventBus from './DisplayEventBus';

export default class Display {
  stage: Konva.Stage;
  layer: Konva.Layer;
  bm: BindingManager;
  cm: ComponentManager;
  plugins: DisplayPlugin[];
  eventBus: DisplayEventBus;

  constructor(
    stage: Konva.Stage,
    layer: Konva.Layer,
    bindingData?: BindingData[],
  ) {
    this.stage = stage;
    this.layer = layer;
    this.eventBus = new DisplayEventBus(stage, this.cm);
    this.bm = new BindingManager(bindingData);
    this.cm = new ComponentManager(stage, layer, this.eventBus);

    this.plugins = [
      new ComponentTransformerPlugin(this.eventBus),
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
    const inputDict = this.bm.getInputDict(gamepad);
    this.cm.update(inputDict, dt);
  }
}
