import Konva from 'konva';

import Component from '../component';

type ComponentCallback = (c: Component<any>) => any;

export default class ComponentManager {
  layer: Konva.Layer;
  components: Component<any>[] = [];

  callbacks: {
    add: ComponentCallback[];
    remove: ComponentCallback[];
  } = {
    add: [],
    remove: [],
  };

  constructor(stage, layer) {
    this.layer = layer;
    stage.add(this.layer);
  }

  onAddedComponent(callback: ComponentCallback) {
    this.callbacks.add.push(callback);
  }

  onRemovedComponent(callback: ComponentCallback) {
    this.callbacks.remove.push(callback);
  }

  add(component: Component<any>) {
    this.components.push(component);
    this.layer.add(component.group);

    this.callbacks.add.forEach(cb => cb(component));
  }

  remove(component: Component<any>) {
    const idx = this.components.indexOf(component);

    if (idx >= 0) {
      const component = this.components[idx];
      component.group.remove();
      this.callbacks.remove.forEach(cb => cb(component));

      this.components.splice(idx, 1);
    }
  }
}
