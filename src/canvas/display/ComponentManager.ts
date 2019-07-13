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

  sync(components: T.SerializedComponent[]): void {
    const currentById = keyBy(this.components, c => c.getId());
    // const newById = keyBy(components, c => c.getBindingId());

    components.forEach(component => {
      const existing = currentById[component.id];

      if (!existing) {
        this.add(deserializeComponent(component));
      } else if (component.inputMap !== existing.getInputMap()) {
        existing.setInputMap(component.inputMap);
      }
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

  update(globalInput: T.GlobalInput, dt: number): void {
    this.components.forEach(
      <I extends Record<string, T.Input>>(component: T.TypedComponent<I>) => {
        const getControllerKeyInput = (
          controllerKey: Maybe<T.ControllerKey>,
        ): Maybe<T.Input> => {
          if (!controllerKey) return;

          const { controllerId, key } = controllerKey;
          const controllerInput = globalInput[controllerId];
          return controllerInput && controllerInput[key];
        };

        const componentInput: Record<string, Maybe<T.Input>> = map(
          getControllerKeyInput,
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
