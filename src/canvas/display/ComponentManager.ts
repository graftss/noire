import Konva from 'konva';
import { map } from 'ramda';

import * as T from '../../types';
import { deserializeComponent } from '../component/deserializeComponent';
import { Component } from '../component/Component';
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
  sync(components: T.SerializedComponent[]): void {
    const currentById = keyBy(this.components, c => c.getId());
    // const newById = keyBy(components, c => c.getBindingId());

    components.forEach(component => {
      if (!currentById[component.id]) this.add(deserializeComponent(component));
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

  update(input: T.AllInput, dt: number): void {
    this.components.forEach(
      <I extends Record<string, T.RawInput>>(
        component: T.TypedComponent<I>,
      ) => {
        // TODO: understand what the hell is going on with the types here
        const componentInput: Record<keyof I, T.RawInput> = map(
          (key): T.RawInput => key && input[key.controllerId][key.key].input,
          component.getInputMap(),
        );

        component.update(componentInput as I, dt);
      },
    );
  }

  findById(componentId: string): Component {
    return find(c => c.getId() === componentId, this.components);
  }
}
