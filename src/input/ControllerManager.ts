import * as T from '../types';
import {
  updateComponentState,
  updateComponentFilters,
  updateControllerBinding,
  stopListening,
} from '../state/actions';
import {
  controllerWithBinding,
  allControllers,
  componentById,
} from '../state/selectors';
import { DisplayEventBus } from '../canvas/display/DisplayEventBus';
import {
  deserializeComponentFilterDict,
  updateComponentKey,
  updateComponentFilterKey,
} from '../canvas/component';
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
    const c = controllerWithBinding(state.input, binding);
    const component = componentById(state.display, componentId);

    if (c && component) {
      const { controller, key } = c;
      const update: T.ComponentKeyUpdate = {
        componentId,
        inputKey,
        controllerKey: { controllerId: controller.id, key },
      };

      const newState = updateComponentKey(
        component.state as T.ComponentState,
        update,
      );
      this.store.dispatch(updateComponentState(componentId, newState));
      this.eventBus.emit({
        kind: 'componentUpdateState',
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
    const c = controllerWithBinding(state.input, binding);
    const component = componentById(state.display, componentId);

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
          kind: 'componentUpdateFilterKey',
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
        const { componentId, inputKind, componentFilterKey } = remap;
        const handler = this.onAwaitedFilterBinding(
          componentId,
          componentFilterKey,
        );
        this.nextInputListener.await(inputKind, handler);
      }
    }
  };

  getInput(): GlobalControllerInput {
    const result: GlobalControllerInput = {};
    const controllers = allControllers(this.store.getState().input);

    controllers.forEach((controller: T.Controller) => {
      const controllerInput: Dict<T.Input> = {};

      for (const bindingKey in controller.bindings) {
        const binding: Maybe<T.Binding> = controller.bindings[bindingKey];
        if (!binding) continue;

        const input: Maybe<T.Input> = this.globalInputSources.parseBinding(
          binding,
        );
        if (!input) continue;

        controllerInput[bindingKey] = input;
      }

      result[controller.id] = controllerInput;
    });

    return result;
  }

  update(): void {
    this.nextInputListener.update();
  }
}
