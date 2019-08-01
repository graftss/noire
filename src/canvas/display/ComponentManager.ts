import { map } from 'ramda';
import * as T from '../../types';
import { Component } from '../component/Component';
import { find, mapObj } from '../../utils';
import { DisplayEventBus } from './DisplayEventBus';

export class ComponentManager {
  private components: Component[] = [];

  constructor(private eventBus: DisplayEventBus) {
    eventBus.on({
      kind: 'componentUpdateState',
      cb: (id: string, state: T.ComponentState) => {
        const component = this.findById(id);
        if (component) component.setState(state);
      },
    });

    eventBus.on({
      kind: 'componentUpdateFilterKey',
      cb: (id: string, filters: T.ComponentFilterDict) => {
        const component = this.findById(id);
        if (component) component.setFilters(filters);
      },
    });
  }

  sync(components: Component[] = []): void {
    components.forEach(this.add);
    this.components = components;
  }

  add = (component: Component) => {
    this.components.push(component);
    this.eventBus.emit({
      kind: 'componentAdd',
      data: [component],
    });
  };

  update(globalInput: T.GlobalControllerInput, dt: number): void {
    if ((window as any).stopUpdating) return;

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

    this.components.forEach((component: Component) => {
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
