import { compose, map } from 'ramda';
import * as T from '../types';
import { find, mapObj, unMaybeObj } from '../utils';
import { rawifyInputDict } from '../input/input';
import * as events from './events';
import { Component } from './component/Component';
import { DisplayEventBus } from './events/DisplayEventBus';

export class ComponentManager {
  private components: Component[] = [];

  constructor(private eventBus: DisplayEventBus) {
    eventBus.on({
      kind: 'setComponentState',
      cb: ({ id, state }) => {
        const component = this.findById(id);
        if (component) component.updateState(state);
      },
    });

    eventBus.on({
      kind: 'setComponentFilters',
      cb: ({ id, filters }) => {
        const component = this.findById(id);
        if (component) component.setFilters(filters);
      },
    });

    eventBus.on({ kind: 'requestAddComponent', cb: this.add });
    eventBus.on({ kind: 'requestRemoveComponent', cb: this.remove });
  }

  add = (component: Component): void => {
    this.components.push(component);
    this.eventBus.emit(events.addComponent(component));
  };

  remove = (id: string): void => {
    for (let i = 0; i < this.components.length; i++) {
      if (this.components[i].id === id) {
        this.components.splice(i, 1);
        this.eventBus.emit(events.removeComponent(this.components[i]));
        return;
      }
    }
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

    const getFilterInput = (filter: T.InputFilter): Dict<Maybe<T.Input>> =>
      mapObj(getControllerKeyInput, filter.inputMap);

    this.components.forEach((component: Component) => {
      const componentInput: Dict<Maybe<T.Input>> = map(
        getControllerKeyInput,
        component.state.inputMap,
      );

      const componentRawInput = compose(
        component.applyDefaultInput,
        rawifyInputDict,
        unMaybeObj as (i: Dict<Maybe<T.Input>>) => Dict<T.Input>,
      )(componentInput);

      const filterInput = mapObj(
        modelFilters =>
          modelFilters &&
          modelFilters.map(
            compose(
              rawifyInputDict,
              getFilterInput,
            ),
          ),
        component.filters,
      );

      component.updateFilters(filterInput);
      component.update(componentRawInput, dt);
    });
  }

  findById(id: string): Maybe<Component> {
    return find(c => c.id === id, this.components);
  }
}
