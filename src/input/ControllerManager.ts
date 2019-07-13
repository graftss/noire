import * as T from '../types';
import {
  bindComponentKey,
  unbindComponentKey,
  bindControllerKey,
  stopListening,
} from '../state/actions';
import { controllerKeyWithBinding } from '../state/selectors';
import { applyControllerKeymap } from './controllers';
import { NextInputListener } from './NextInputListener';
import { dereferenceSource } from './sources';

// keyed first by controller id and second by controller key
export type GlobalInput = Dict<Dict<T.Input>>;

const gamepadSourceRefs: T.GamepadSourceRef[] = [0, 1, 2, 3].map(index => ({
  kind: 'gamepad',
  index,
}));

export class ControllerManager {
  private nextInputListener: NextInputListener;
  private sourceRefs: T.GlobalSourceRefs = {
    gamepads: gamepadSourceRefs,
    keyboard: { kind: 'keyboard' },
  };

  constructor(private store: T.EditorStore) {
    this.nextInputListener = new NextInputListener();
    store.subscribe(() => this.storeSubscriber());
  }

  private onAwaitedControllerBinding = (controllerId: string, key: string) => <
    B extends T.Binding
  >(
    binding: B,
  ): void => {
    this.store.dispatch(stopListening());
    this.store.dispatch(bindControllerKey({ controllerId, key, binding }));
  };

  private onAwaitedComponentBinding = (
    componentId: string,
    bindingKey: string,
  ) => <B extends T.Binding>(binding: B): void => {
    const state = this.store.getState();
    const controllerKey: Maybe<T.ControllerKey> = controllerKeyWithBinding(
      state.input,
      binding,
    );

    if (controllerKey) {
      this.store.dispatch(
        bindComponentKey({
          componentId,
          bindingKey,
          controllerKey,
        }),
      );
    } else {
      this.store.dispatch(unbindComponentKey({ componentId, bindingKey }));
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

        switch (remap.inputKind) {
          case 'button':
            return this.nextInputListener.awaitButton(handler);
          case 'axis':
            return this.nextInputListener.awaitPositiveAxis(handler);
        }

        break;
      }

      case 'component': {
        const handler = this.onAwaitedComponentBinding(
          remap.componentId,
          remap.key,
        );

        switch (remap.inputKind) {
          case 'button':
            return this.nextInputListener.awaitButton(handler);
          case 'axis':
            return this.nextInputListener.awaitPositiveAxis(handler);
        }

        break;
      }
    }
  };

  private sourceRefArray(): T.InputSourceRef[] {
    const { gamepads, keyboard } = this.sourceRefs;
    return [...gamepads, keyboard];
  }

  getInput(): GlobalInput {
    const result = {};
    const controllers = this.store.getState().input.controllers;

    this.sourceRefs.gamepads.forEach(ref => {
      controllers.forEach(controller => {
        const source = dereferenceSource(ref);
        const keymap = applyControllerKeymap(source, controller);
        if (keymap) result[controller.id] = keymap;
      });
    });

    return result;
  }

  update(): void {
    if (this.nextInputListener.isActive()) {
      this.nextInputListener.update(this.sourceRefArray());
    }
  }
}
