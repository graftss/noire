import { map } from 'ramda';
import * as T from '../../types';
import { deserializeComponent } from '../component/';
import { Component } from '../component/Component';
import { find, keyBy } from '../../utils';
import { DisplayEventBus } from './DisplayEventBus';
import { ImageManager } from './ImageManager';

const CLICK_EVENT = `click.ComponentManager`;

export class ComponentManager {
  private components: Component[] = [];

  constructor(
    private eventBus: DisplayEventBus,
    private imageManager: ImageManager,
  ) {}

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
      } else if (component.state.inputMap !== existing.state.inputMap) {
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

      const componentInput: Dict<Maybe<T.Input>> = map(
        getControllerKeyInput,
        component.state.inputMap || {},
      );

      component.update(componentInput, dt);
    });
  }

  findById(id: string): Maybe<Component> {
    return find(c => c.id === id, this.components);
  }
}
