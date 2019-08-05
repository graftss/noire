import { compose, map } from 'ramda';
import * as T from '../types';
import { find, mapObj, unMaybeObj } from '../utils';
import { rawifyInputDict } from '../input/input';
import { Component } from './component/Component';
import { DisplayEventBus } from './DisplayEventBus';

export class ComponentManager {
  private components: Component[] = [];

  constructor(private eventBus: DisplayEventBus) {
    eventBus.on({
      kind: 'updateComponentState',
      cb: ([id, state]) => {
        const component = this.findById(id);
        if (component) component.updateState(state);
      },
    });

    eventBus.on({
      kind: 'updateComponentFilters',
      cb: ([id, filters]) => {
        const component = this.findById(id);
        if (component) component.setFilters(filters);
      },
    });
  }

  sync(components: Component[] = []): void {
    this.components = components;
    components.forEach(component => {
      this.add(component);
      this.eventBus.emit({ kind: 'addComponent', data: component });
    });
  }

  add = (component: Component) => {
    this.components.push(component);
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
    ): Dict<Maybe<T.Input>> => mapObj(getControllerKeyInput, filter.inputMap);

    this.components.forEach((component: Component) => {
      const componentInput: Dict<Maybe<T.Input>> = map(
        getControllerKeyInput,
        component.state.inputMap || {},
      );

      const componentRawInput = compose(
        component.applyDefaultInput,
        rawifyInputDict,
        unMaybeObj as (i: Dict<Maybe<T.Input>>) => Dict<T.Input>,
      )(componentInput);

      const filterInput =
        component.filters &&
        mapObj(
          modelFilters =>
            modelFilters.map(
              compose(
                rawifyInputDict,
                getFilterInput,
              ),
            ),
          component.filters,
        );

      component.applyFilterInput(filterInput);
      component.update(componentRawInput, dt);
    });
  }

  findById(id: string): Maybe<Component> {
    return find(c => c.id === id, this.components);
  }
}
