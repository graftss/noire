import { map } from 'ramda';
import * as T from '../../types';
import { deserializeComponent } from '../component/';
import { Component } from '../component/Component';
import { find, keyBy, mapObj } from '../../utils';
import { DisplayEventBus } from './DisplayEventBus';

export class ComponentManager {
  private components: Component[] = [];

  constructor(private eventBus: DisplayEventBus) {}

  reset(components: Component[] = []): void {
    components.forEach(this.add);
    this.components = components;
  }

  sync(components: T.SerializedComponent[]): void {
    const currentById = keyBy(this.components, c => c.id);
    // const newById = keyBy(components, c => c.getBindingId());

    components.forEach(component => {
      const existing = currentById[component.id];

      if (!existing) {
        this.add(deserializeComponent(component));
      } else if (
        component.state &&
        component.state.inputMap !== existing.state.inputMap
      ) {
        existing.state.inputMap = component.state.inputMap;
      }
    });

    // this.components.forEach(component => {
    //   if (!newById[component.getBindingId()]) this.remove(component);
    // });
  }

  add = (component: Component) => {
    this.components.push(component);
    this.eventBus.emit({
      kind: 'componentAdd',
      data: [component],
    });
  };

  update(globalInput: T.GlobalControllerInput, dt: number): void {
    this.components.forEach((component: Component) => {
      const getControllerKeyInput = (
        controllerKey: Maybe<T.ControllerKey>,
      ): Maybe<T.Input> => {
        if (!controllerKey) return;

        const { controllerId, key } = controllerKey;
        const controllerInput = globalInput[controllerId];
        return controllerInput && controllerInput[key];
      };

      const getFilterInput = (
        filter: T.ComponentFilter<T.InputFilterKind>,
      ): Dict<Maybe<T.Input>> => mapObj(filter.inputMap, getControllerKeyInput);

      const componentInput: Dict<Maybe<T.Input>> = map(
        getControllerKeyInput,
        component.state.inputMap || {},
      );

      const filterInput =
        component.filters &&
        mapObj(component.filters, shapeFilters =>
          shapeFilters.map(getFilterInput),
        );

      component.applyFilterInput(filterInput);
      component.update(componentInput, dt);
    });
  }

  findById(id: string): Maybe<Component> {
    return find(c => c.id === id, this.components);
  }
}
