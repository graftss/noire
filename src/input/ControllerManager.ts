import * as T from '../types';
import {
  updateComponentState,
  updateComponentFilters,
  updateControllerBinding,
  stopListening,
} from '../state/actions';
import {
  controllerWithBinding,
  controllers,
  componentById,
} from '../state/selectors';
import { DisplayEventBus } from '../display/DisplayEventBus';
import {
  deserializeComponentFilterDict,
  updateComponentKey,
  updateComponentFilterKey,
} from '../display/component';
import { NextInputListener } from './NextInputListener';
import { GlobalInputSources } from './source/GlobalInputSources';
import { getGamepads } from './source/gamepad';
import { getLocalKeyboard } from './source/keyboard';
import { defaultListenedKeyCodes } from './controller/keyboard';

// keyed first by controller id and second by controller key
export type GlobalControllerInput = Dict<Dict<T.Input>>;

export class ControllerManager {
  private globalInputSources: GlobalInputSources;
  private nextInputListener: NextInputListener;

  constructor(private store: T.EditorStore, private eventBus: DisplayEventBus) {
    this.globalInputSources = new GlobalInputSources({
      gamepad: getGamepads,
      keyboard: () => getLocalKeyboard(document, defaultListenedKeyCodes),
    });

    this.nextInputListener = new NextInputListener(
      this.globalInputSources.snapshotInput,
      this.globalInputSources.snapshotDiff,
    );

    eventBus.on({ kind: 'listenNextInput', cb: this.onListenNextInput });
  }

  private onAwaitedControllerBinding = (controllerId: string, key: string) => (
    binding: T.Binding,
  ): void => {
    this.store.dispatch(stopListening());
    this.store.dispatch(
      updateControllerBinding({ controllerId, key, binding }),
    );
  };

  private onAwaitedComponentBinding = (
    componentId: string,
    inputKey: string,
  ) => (binding: T.Binding): void => {
    const state = this.store.getState();
    const bindingLocation = controllerWithBinding(state)(binding);
    const component = componentById(state)(componentId);

    if (bindingLocation && component) {
      const { controller, key } = bindingLocation;
      const update: T.ComponentKeyUpdate = {
        componentId,
        inputKey,
        controllerKey: { controllerId: controller.id, key },
      };
      const newState = updateComponentKey(component.state, update);

      this.store.dispatch(updateComponentState(componentId, newState));
      this.eventBus.emit({
        kind: 'updateComponentState',
        data: [componentId, newState],
      });
    } else {
      // TODO: handle input that's not already mapped to a controller,
      // probably by dispatching an event to the store to let them
      // know that their input is unmapped
    }

    this.store.dispatch(stopListening());
  };

  private onAwaitedFilterBinding = (
    componentId: string,
    componentFilterKey: T.ComponentFilterKey,
  ) => (binding: T.Binding): void => {
    const state = this.store.getState();
    const c = controllerWithBinding(state)(binding);
    const component = componentById(state)(componentId);

    if (c && component) {
      const { controller, key } = c;
      const update: T.ComponentFilterKeyUpdate = {
        componentId,
        componentFilterKey,
        controllerKey: { controllerId: controller.id, key },
      };

      if (component.filters) {
        const newFilters = updateComponentFilterKey(component.filters, update);

        this.store.dispatch(updateComponentFilters(componentId, newFilters));
        this.eventBus.emit({
          kind: 'updateComponentFilters',
          data: [componentId, deserializeComponentFilterDict(newFilters)],
        });
      }
    } else {
      // TODO: handle input that's not already mapped to a controller;
      // see above in `onAwaitedComponentBinding`
      // see above in `onAwaitedComponentBinding`
    }

    this.store.dispatch(stopListening());
  };

  private onListenNextInput = (remap: T.RemapState): void => {
    switch (remap.kind) {
      case 'controller': {
        const { controllerId, inputKind, key } = remap;
        const handler = this.onAwaitedControllerBinding(controllerId, key);
        this.nextInputListener.await(inputKind, handler);
        break;
      }

      case 'component': {
        const { componentId, inputKind, key } = remap;
        const handler = this.onAwaitedComponentBinding(componentId, key);
        this.nextInputListener.await(inputKind, handler);
        break;
      }

      case 'filter': {
        const { componentId: id, inputKind, componentFilterKey: key } = remap;
        const handler = this.onAwaitedFilterBinding(id, key);
        this.nextInputListener.await(inputKind, handler);
        break;
      }
    }
  };

  getInput(): GlobalControllerInput {
    const result: GlobalControllerInput = {};
    const cs = controllers(this.store.getState());

    cs.forEach((controller: T.Controller) => {
      const controllerInput: Dict<T.Input> = {};

      for (const bindingKey in controller.bindings) {
        const binding = controller.bindings[bindingKey];
        if (!binding) continue;

        const input = this.globalInputSources.parseBinding(binding);
        if (input) controllerInput[bindingKey] = input;
      }

      result[controller.id] = controllerInput;
    });

    return result;
  }

  update(): void {
    this.nextInputListener.update();
  }
}
