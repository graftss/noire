import Konva from 'konva';

import Component from '../component';
import * as M from '../gamepad/inputMaps';

type ComponentCallback = (c: Component<any>) => any;

type ComponentData = {
  component: Component<any>;
  bindingId: number;
};

export default class ComponentManager {
  layer: Konva.Layer;
  componentData: ComponentData[] = [];

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

  add(data: ComponentData) {
    this.componentData.push(data);
    this.layer.add(data.component.group);

    this.callbacks.add.forEach(cb => cb(data.component));
  }

  // remove(component: Component<any>) {
  //   const idx = this.components.indexOf(component);

  //   if (idx >= 0) {
  //     const component = this.components[idx];
  //     component.group.remove();
  //     this.callbacks.remove.forEach(cb => cb(component));

  //     this.components.splice(idx, 1);
  //   }
  // }

  update(inputDict: ({ [bindingId: number] : M.Input }), dt: number) {
    this.componentData.forEach(({ component, bindingId }) => {
      component.update(inputDict[bindingId].input, dt);
    });
  }
}
