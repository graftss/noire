import keycode from 'keycode';
import * as T from '../../types';

export type KeyboardControllerClass = T.BaseControllerClass & {
  kind: 'keyboard';
};

export type KeyboardController = T.BaseController<KeyboardControllerClass>;

const lower = "qwertyuiopasdfghjklzxcvbnm1234567890,.;'[]/";
const letterList: string[] = lower.split('');

export const keyboardMap: Dict<T.ControllerKeyData> = letterList
  .map(l => ({ name: l, inputKind: 'button', key: l }))
  .reduce((result, v: T.ControllerKeyData) => ({ ...result, [v.name]: v }), {});

export const defaultListenedKeyCodes: number[] = letterList.map(keycode);

const letterToBinding = (l: string): T.KeyboardKeyBinding => ({
  kind: 'key',
  sourceKind: 'keyboard',
  ref: { kind: 'keyboard' },
  inputKind: 'button',
  keyCode: keycode(l),
});

const defaultKeyBindingDict: Dict<T.KeyboardKeyBinding> = letterList
  .map(letterToBinding)
  .reduce((result, b) => ({ ...result, [keycode(b.keyCode)]: b }), {});

export const defaultKeyboardController: T.KeyboardController = {
  id: 'test keyboard',
  name: 'test keyboard',
  controllerKind: 'keyboard',
  bindings: defaultKeyBindingDict,
};
