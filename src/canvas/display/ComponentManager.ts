import Konva from 'konva';
import { map } from 'ramda';
import * as T from '../../types';
import { deserializeComponent } from '../component/deserializeComponent';
import { Component, TypedComponent } from '../component/Component';
import { cast, find, keyBy } from '../../utils';
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
    components.forEach(this.add);

    this.components.forEach(component => {
      const gc: Maybe<Component & T.GroupContainer> = cast(
        c => c && c.group,
        component,
      );
      if (gc) {
        gc.group.destroy();
      }
    });

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

    const gc: Maybe<Component & T.GroupContainer> = cast(
      c => c && c.group,
      component,
    );
    if (gc) {
      this.layer.add(gc.group);

      gc.group.on(CLICK_EVENT, () => {
        this.eventBus.emit({
          kind: 'componentSelect',
          data: [gc],
        });

        this.eventBus.emit({
          kind: 'groupComponentSelect',
          data: [gc],
        });
      });
    }
  };

  update(globalInput: T.GlobalInput, dt: number): void {
    this.components.forEach(
      <I extends Dict<T.Input>, S extends T.BaseComponentState<I>>(
        component: TypedComponent<I, S>,
      ) => {
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

        component.update(componentInput as I, dt);
      },
    );
  }

  findById(id: string): Maybe<Component> {
    return find(c => c.id === id, this.components);
  }
}
