import Konva from 'konva';

import * as T from '../../types';
import { Component } from '../component';
import { DisplayEventBus } from './DisplayEventBus';
import { find, keyBy } from '../../utils';

const CLICK_EVENT = `click.ComponentManager`;

export class ComponentManager {
  private components: Component[] = [];
  private selectedId?: string;

  constructor(
    private stage: Konva.Stage,
    private layer: Konva.Layer,
    private eventBus: DisplayEventBus,
  ) {
    this.layer = layer;
  }

  reset(components: Component[] = []): void {
    this.components.forEach(component => component.group.destroy());

    this.components = components;
    components.forEach(this.add);
  }

  // TODO: update binding ids here too
  sync(components: Component[]): void {
    const currentById = keyBy(this.components, c => c.getBindingId());
    // const newById = keyBy(components, c => c.getBindingId());

    components.forEach(component => {
      if (!currentById[component.getBindingId()]) this.add(component);
    });

    // this.components.forEach(component => {
    //   if (!newById[component.getBindingId()]) this.remove(component);
    // });
  }

  add = (component: Component) => {
    this.components.push(component);
    this.layer.add(component.group);

    this.eventBus.emit({
      kind: 'componentAdd',
      data: [component],
    });

    component.group.on(CLICK_EVENT, () => {
      this.eventBus.emit({
        kind: 'componentSelect',
        data: [component],
      });
    });
  };

  // setBindingId(newData: T.Component): boolean {
  //   for (let i = 0; i < this.componentData.length; i++) {
  //     const data = this.componentData[i];
  //     if (newData.component === data.component) {
  //       data.bindingId = newData.bindingId;
  //       return true;
  //     }
  //   }

  //   return false;
  // }

  update(inputDict: { [bindingId: number]: T.Input }, dt: number): void {
    this.components.forEach((component: Component) => {
      const bindingId = component.getBindingId();
      const input = inputDict[bindingId];
      if (input) {
        component.update(inputDict[bindingId].input, dt);
      }
    });
  }

  findById(componentId: string): Component {
    return find(c => c.getId() === componentId, this.components);
  }
}
