import Konva from 'konva';

import * as T from '../types';
import { Component } from '../component';
import { DisplayEventBus } from './DisplayEventBus';

const CLICK_EVENT = `click.ComponentManager`;

export class ComponentManager {
  private selected: T.ComponentData[] = [];

  constructor(
    private stage: Konva.Stage,
    private layer: Konva.Layer,
    private eventBus: DisplayEventBus,
    private componentData: T.ComponentData[] = [],
  ) {
    this.layer = layer;

    componentData.forEach(this.add);
  }

  public add = (data: T.ComponentData) => {
    this.componentData.push(data);
    this.layer.add(data.component.group);

    this.eventBus.emit({
      kind: 'componentAdd',
      data: [data],
    });

    data.component.group.on(CLICK_EVENT, () => {
      this.eventBus.emit({
        kind: 'componentClick',
        data: [data],
      });
    });
  }

  public setBindingId(data: T.ComponentData) {
    for (let i = 0; i < this.componentData.length; i++) {
      const next = this.componentData[i];
      if (next.component === data.component) {
        return next.bindingId = data.bindingId;
      }
    }
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

  public update(inputDict: ({ [bindingId: number] : T.Input }), dt: number) {
    this.componentData.forEach(({ component, bindingId }) => {
      const input = inputDict[bindingId];
      if (input) {
        component.update(inputDict[bindingId].input, dt);
      }
    });
  }
}
