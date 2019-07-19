import keycode from 'keycode';
import * as T from '../../../types';
import { equals } from '../../../utils';
import { Keyboard } from './Keyboard';

type KeyboardKind = 'keyboard';

export type KeyboardSourceRef = T.TypedSourceRef<KeyboardKind>;

export type KeyboardSourceContainer = T.TypedSourceContainer<KeyboardKind> & {
  ref: KeyboardSourceRef;
  keyboard: Maybe<Keyboard>;
};

type BaseKeyboardBinding = T.TypedBinding<KeyboardKind, KeyboardSourceRef>;

export type KeyboardKeyBinding = BaseKeyboardBinding & {
  kind: 'key';
  inputKind: 'button';
  keyCode: number;
};

export type KeyboardBinding = KeyboardKeyBinding;

export type KeyboardState = Record<number, boolean>;

export type KeyboardInputSnapshot = Record<T.InputKind, object> & {
  button: KeyboardState;
};

export type KeyboardSource = T.TypedInputSource<
  KeyboardKind,
  KeyboardSourceRef,
  KeyboardSourceContainer,
  KeyboardBinding,
  KeyboardInputSnapshot
>;

export type KeyboardSourceFactory = T.TypedInputSourceFactory<
  KeyboardKind,
  KeyboardSourceRef,
  KeyboardSourceContainer,
  KeyboardBinding,
  KeyboardInputSnapshot,
  Maybe<Keyboard>
>;

export const getLocalKeyboard = (
  document: HTMLDocument,
  listenedKeyCodes: number[],
): Keyboard => {
  const keyboard = new Keyboard(listenedKeyCodes);

  document.addEventListener('keydown', keyboard.onKeyDown);
  document.addEventListener('keyup', keyboard.onKeyUp);

  return keyboard;
};

const stringifyBinding = (b: KeyboardBinding): string => {
  return keycode(b.keyCode);
};

const areBindingsEqual = (b1: KeyboardBinding, b2: KeyboardBinding): boolean =>
  equals(b1, b2);

export const keyboardBindingAPI: T.InputSourceBindingAPI<
  KeyboardKind,
  KeyboardSourceRef,
  KeyboardBinding
> = {
  stringifyBinding,
  areBindingsEqual,
};

export const keyboardSourceFactory: KeyboardSourceFactory = (
  getKeyboard: () => Maybe<Keyboard>,
) => {
  const _keyboard: Maybe<Keyboard> = getKeyboard();

  const dereference = (ref: KeyboardSourceRef): KeyboardSourceContainer => ({
    kind: 'keyboard',
    ref,
    keyboard: _keyboard,
  });

  function parseBinding(b: KeyboardKeyBinding): Maybe<T.ButtonInput>;
  function parseBinding(b: KeyboardBinding): Maybe<T.Input> {
    const s = dereference(b.ref);
    if (!s.keyboard) return;

    switch (b.kind) {
      case 'key': {
        return {
          kind: 'button',
          input: s.keyboard.isDown(b.keyCode),
        };
      }
    }
  }

  const exists = (s: KeyboardSourceContainer): boolean =>
    s.keyboard !== undefined;

  const snapshotInput = <K extends T.InputKind>(
    ref: KeyboardSourceRef,
    kind: K,
  ): Maybe<KeyboardInputSnapshot[K]> => {
    const keyboard = dereference(ref).keyboard;
    if (!keyboard) return;

    switch (kind) {
      case 'button':
        return keyboard.getButtonSnapshot();
    }
  };

  const snapshotBindingDiff = <IK extends T.InputKind>(
    ref: KeyboardSourceRef,
    kind: IK,
    input: KeyboardInputSnapshot[IK],
    baseline: KeyboardInputSnapshot[IK],
  ): Maybe<T.BindingOfInputType<IK>> => {
    switch (kind) {
      case 'button': {
        const b1 = input as KeyboardInputSnapshot['button'];
        const b2 = baseline as KeyboardInputSnapshot['button'];

        for (const keyCode in b1) {
          if (b1[keyCode] && b1[keyCode] !== b2[keyCode]) {
            const result: KeyboardKeyBinding = {
              kind: 'key',
              inputKind: 'button',
              sourceKind: 'keyboard',
              ref,
              keyCode: parseInt(keyCode),
            };

            return result as T.BindingOfInputType<IK>;
          }
        }
      }
    }
  };

  return {
    kind: 'keyboard',
    dereference,
    parseBinding,
    exists,
    snapshotInput,
    snapshotBindingDiff,
  };
};
