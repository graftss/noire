import Konva from 'konva';

import ComponentManager from '../component/ComponentManager';

export default abstract class Display<T> {
  componentManager: ComponentManager;

  constructor(stage) {
    this.componentManager = new ComponentManager(stage);
  }

  abstract update(input: T, dt: number): void

  draw() {
    this.componentManager.draw();
  }
}
