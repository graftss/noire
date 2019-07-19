import * as T from '../types';
import {
  updateComponentKey,
  updateControllerBindings,
  stopListening,
} from '../state/actions';
import { controllerWithBinding, allControllers } from '../state/selectors';
import { mapObj, range } from '../utils';
import { NextInputListener } from './NextInputListener';
import { GlobalInputSources } from './source';
import { getGamepads } from './source/gamepad';
import { getLocalKeyboard } from './source/keyboard';

// keyed first by controller id and second by controller key
export type GlobalControllerInput = Dict<Dict<T.Input>>;

const gamepadSourceRefs: T.GamepadSourceRef[] = [0, 1, 2, 3].map(index => ({
  kind: 'gamepad',
  index,
}));

const listenedKeyCodes = range(48, 57).concat(65, 90);

export class ControllerManager {
  private globalInputSources: GlobalInputSources;
  private nextInputListener: NextInputListener;
  private sourceRefs: T.GlobalSourceRefs = {
    gamepads: gamepadSourceRefs,
    keyboard: { kind: 'keyboard' },
  };

  constructor(private store: T.EditorStore) {
    this.globalInputSources = new GlobalInputSources({
      gamepad: getGamepads,
      keyboard: () => getLocalKeyboard(document, listenedKeyCodes),
    });

    this.nextInputListener = new NextInputListener(this.globalInputSources);
    store.subscribe(() => this.storeSubscriber());
  }

  private onAwaitedControllerBinding = (controllerId: string, key: string) => (
    binding: T.Binding,
  ): void => {
    this.store.dispatch(stopListening());
    this.store.dispatch(
      updateControllerBindings({ controllerId, key, binding }),
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

  private storeSubscriber = (): void => {
    const { remap } = this.store.getState().input;
    if (!remap) return;

    switch (remap.kind) {
      case 'controller': {
        const handler = this.onAwaitedControllerBinding(
          remap.controllerId,
          remap.key,
        );

        this.nextInputListener.await(remap.inputKind, handler);
        break;
      }

      case 'component': {
        const handler = this.onAwaitedComponentBinding(
          remap.componentId,
          remap.key,
        );

        this.nextInputListener.await(remap.inputKind, handler);
        break;
      }
    }
  };

  private parseController = <C extends T.BaseControllerClass>(
    source: T.SourceContainer,
    { bindings }: T.BaseController<C>,
  ): Maybe<Dict<Maybe<T.Input>>> => {
    const { parseBinding, sourceExists } = this.globalInputSources;
    return !sourceExists(source)
      ? undefined
      : mapObj(
          bindings,
          // TODO: type this
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (b: Maybe<T.Binding>) => b && parseBinding(b as any, source as any),
        );
  };

  getInput(): GlobalControllerInput {
    const result = {};
    const controllers = allControllers(this.store.getState().input);

    this.sourceRefs.gamepads.forEach(ref => {
      controllers.forEach(
        <C extends T.BaseControllerClass>(controller: T.BaseController<C>) => {
          const source = this.globalInputSources.dereference(ref);
          const keymap = this.parseController(source, controller);
          if (keymap) result[controller.id] = keymap;
        },
      );
    });

    return result;
  }

  update(): void {
    if (this.nextInputListener.isActive()) {
      this.nextInputListener.update(this.sourceRefs);
    }
  }
}
