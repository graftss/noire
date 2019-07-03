import Konva from 'konva';

import Component from '.';

export default class ComponentManager {
  components: Component<any>[] = [];
  stage: Konva.Stage;
  layer: Konva.Layer;

  constructor(stage) {
    this.layer = new Konva.Layer();
    this.stage = stage;

    stage.add(this.layer);
  }

  add(component: Component<any>) {
    this.components.push(component);
    this.layer.add(component.group);
  }

  remove(component: Component<any>) {
    const idx = this.components.indexOf(component);

    if (idx >= 0) {
      const component = this.components[idx];
      component.group.remove();

      this.components.splice(idx, 1);
    }
  }

  draw() {
    this.layer.draw();
  }
}
