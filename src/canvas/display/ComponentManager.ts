import Konva from 'konva';

import * as T from '../types';
import { DisplayEventBus } from './DisplayEventBus';

const CLICK_EVENT = `click.ComponentManager`;

export class ComponentManager {
  private componentData: T.ComponentData[] = [];

  constructor(
    private stage: Konva.Stage,
    private layer: Konva.Layer,
    private eventBus: DisplayEventBus,
  ) {
    this.layer = layer;
  }

  reset(componentData: T.ComponentData[] = []): void {
    this.componentData.forEach(({ component }) => {
      component.group.destroy();
    });

    this.componentData = componentData;
    componentData.forEach(this.add);
  }

  add = (data: T.ComponentData) => {
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
  };

  // setBindingId(newData: T.ComponentData): boolean {
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
    this.componentData.forEach(({ component, bindingId }) => {
      const input = inputDict[bindingId];
      if (input) {
        component.update(inputDict[bindingId].input, dt);
      }
    });
  }
}
