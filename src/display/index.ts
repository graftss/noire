import Konva from 'konva';

import ComponentManager from '../component/ComponentManager';
import Component from '../component';

export default abstract class Display<T> {
  componentManager: ComponentManager;

  constructor(stage) {
    this.componentManager = new ComponentManager(stage);
  }

  addComponent(component: Component<any>) {
    this.componentManager.add(component);
  }

  removeComponent(component: Component<any>) {
    this.componentManager.remove(component);
  }

  draw() {
    this.componentManager.draw();
  }

  abstract update(input: T, dt: number): void;
}
