import Konva from 'konva';

import * as T from '../types';
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

  setBindingId(newData: T.ComponentData): boolean {
    for (let i = 0; i < this.componentData.length; i++) {
      const data = this.componentData[i];
      if (newData.component === data.component) {
        data.bindingId = newData.bindingId;
        return true;
      }
    }

    return false;
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

  update(inputDict: { [bindingId: number]: T.Input }, dt: number): void {
    this.componentData.forEach(({ component, bindingId }) => {
      const input = inputDict[bindingId];
      if (input) {
        component.update(inputDict[bindingId].input, dt);
      }
    });
  }
}
