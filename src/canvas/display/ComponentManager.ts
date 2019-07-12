import Konva from 'konva';
import { map } from 'ramda';
import * as T from '../../types';
import { deserializeComponent } from '../component/deserializeComponent';
import { Component } from '../component/Component';
import { find, keyBy } from '../../utils';
import { DisplayEventBus } from './DisplayEventBus';

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

  update(input: T.GlobalInput, dt: number): void {
    this.components.forEach(
      <I extends Record<string, T.RawInput>>(
        component: T.TypedComponent<I>,
      ) => {
        const componentInput: Record<keyof I, Maybe<T.RawInput>> = map(
          (controllerKey): Maybe<T.RawInput> => {
            if (!controllerKey) return;
            const { controllerId: id, key } = controllerKey;
            return input[id] && input[id][key] && input[id][key].input;
          },
          component.getInputMap(),
        );

        component.update(componentInput as I, dt);
      },
    );
  }

  findById(componentId: string): Maybe<Component> {
    return find(c => c.getId() === componentId, this.components);
  }
}
