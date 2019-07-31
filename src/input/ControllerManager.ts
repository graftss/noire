import * as T from '../types';
import {
  updateComponentKey,
  updateControllerBinding,
  stopListening,
} from '../state/actions';
import { controllerWithBinding, allControllers } from '../state/selectors';
import { DisplayEventBus } from '../canvas/display/DisplayEventBus';
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

    if (c) {
      const { controller, key } = c;

      this.store.dispatch(
        updateComponentKey({
          componentId,
          inputKey,
          controllerId: controller.id,
          bindingsKey: key,
        }),
      );
    } else {
      this.store.dispatch(updateComponentKey({ componentId, inputKey }));
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
