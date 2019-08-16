import * as T from '../types';
import * as events from '../display/events';
import * as actions from '../state/actions';
import {
  controllerWithBinding,
  controllers,
  componentById,
} from '../state/selectors';
import { DisplayEventBus } from '../display/events/DisplayEventBus';
import {
  getComponentInputFilter,
  updateComponentKey,
} from '../display/component';
import { setInputFilterControllerKey } from '../display/filter';
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
    this.store.dispatch(actions.stopListening());
    this.store.dispatch(
      actions.updateControllerBinding({ controllerId, key, binding }),
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

      this.store.dispatch(actions.setComponentState(componentId, newState));
      this.eventBus.emit(events.setComponentState(componentId, newState));
    } else {
      // TODO: handle input that's not already mapped to a controller,
      // probably by dispatching an event to the store to let them
      // know that their input is unmapped
    }

    this.store.dispatch(actions.stopListening());
  };

  private onAwaitedFilterBinding = (
    id: string,
    ref: T.ComponentFilterRef,
    inputKey: string,
  ) => (binding: T.Binding): void => {
    const state = this.store.getState();
    const c = controllerWithBinding(state)(binding);
    const component = componentById(state)(id);

    if (c && component) {
      const filter = getComponentInputFilter(component, ref);
      if (!filter) return;

      const { controller, key } = c;
      const controllerKey = { controllerId: controller.id, key };
      const newFilter = setInputFilterControllerKey(
        filter,
        inputKey,
        controllerKey,
      );

      const event = events.requestFilterUpdate(id, ref, newFilter);
      const action = actions.setComponentInputFilter(id, ref, newFilter);

      this.store.dispatch(action);
      this.eventBus.emit(event);
    } else {
      // TODO: handle input that's not already mapped to a controller;
      // see above in `onAwaitedComponentBinding`
    }

    this.store.dispatch(actions.stopListening());
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
        const { componentId: id, inputKind, key, ref } = remap;
        const handler = this.onAwaitedFilterBinding(id, ref, key);
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
