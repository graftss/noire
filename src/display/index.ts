import Konva from 'konva';

import Component from '../component';
import ComponentManager from './ComponentManager';
import ComponentTransformerPlugin from './ComponentTransformerPlugin';
import DisplayPlugin from './DisplayPlugin';

export default abstract class Display<T> {
  stage: Konva.Stage;
  layer: Konva.Layer;
  cm: ComponentManager;
  plugins: DisplayPlugin[];

  constructor(stage: Konva.Stage, layer: Konva.Layer) {
    this.stage = stage;
    this.layer = layer;
    this.cm = new ComponentManager(stage, layer);

    this.plugins = [
      new ComponentTransformerPlugin(stage, layer, this.cm),
    ];
  }

  addComponent(component: Component<any>) {
    this.cm.add(component);
  }

  removeComponent(component: Component<any>) {
    this.cm.remove(component);
  }

  draw() {
    this.layer.draw();
  }

  abstract update(input: T, dt: number): void;
}
