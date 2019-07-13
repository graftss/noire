import * as T from '../types';
import { bindControllerKey, stopListening } from '../state/actions';
import { applyControllerKeymap } from './controllers';
import { NextInputListener } from './NextInputListener';
import { dereferenceSource } from './sources';

// keyed first by controller id and second by controller key
export type GlobalInput = Record<string, Record<string, T.Input>>;

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

  private onAwaitedComponentBinding = () => <B extends T.Binding>(
    binding: B,
  ): void => {
    this.store.dispatch(stopListening());
    // this.store.dispatch(bindComponentKey({ }))
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
      }

      case 'component': {
        const handler = this.onAwaitedComponentBinding();
        switch (remap.inputKind) {
          case 'button':
            return this.nextInputListener.awaitButton(handler);
          case 'axis':
            return this.nextInputListener.awaitPositiveAxis(handler);
        }
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
