import Konva from 'konva';

import BindingManager, { BindingData, BindingId } from '../gamepad/BindingManager';
import Component from '../component';
import ComponentManager from './ComponentManager';
import ComponentTransformerPlugin from './plugin/ComponentTransformerPlugin';
import DisplayPlugin from './plugin/DisplayPlugin';

export default class Display {
  stage: Konva.Stage;
  layer: Konva.Layer;
  bm: BindingManager;
  cm: ComponentManager;
  plugins: DisplayPlugin[];

  constructor(
    stage: Konva.Stage,
    layer: Konva.Layer,
    bindingData?: BindingData[],
  ) {
    this.stage = stage;
    this.layer = layer;
    this.bm = new BindingManager(bindingData);
    this.cm = new ComponentManager(stage, layer);

    this.plugins = [
      new ComponentTransformerPlugin(stage, layer, this.cm),
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
