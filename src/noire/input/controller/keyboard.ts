import keycode from 'keycode';
import * as T from '../../types';

const keyOrder = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  ',',
  '.',
  ';',
  "'",
  '[',
  ']',
  '-',
  '=',
  '\\',
] as const;

type KeyboardKey = typeof keyOrder[number];

const map: Record<KeyboardKey, T.ControllerKeyData> = keyOrder
  .map((l): T.ControllerKeyData => ({ name: l, inputKind: 'button', key: l }))
  .reduce(
    (result, v: T.ControllerKeyData) => ({ ...result, [v.name]: v }),
    {},
  ) as Record<KeyboardKey, T.ControllerKeyData>;

const letterToBinding = (l: string): T.KeyboardKeyBinding => ({
  kind: 'key',
  sourceKind: 'keyboard',
  ref: { kind: 'keyboard' },
  inputKind: 'button',
  keyCode: keycode(l),
});

const defaultBindings: Dict<T.KeyboardKeyBinding> = keyOrder
  .map(letterToBinding)
  .reduce((result, b) => ({ ...result, [keycode(b.keyCode)]: b }), {});

export type KeyboardControllerClass = T.BaseControllerClass<KeyboardKey> & {
  kind: 'keyboard';
};

export type KeyboardController = T.BaseController<
  KeyboardKey,
  KeyboardControllerClass
>;

export const defaultListenedKeyCodes: number[] = keyOrder.map(keycode);

export const keyboardConfig: T.ControllerClassConfig<KeyboardKey> = {
  keyOrder,
  map,
  defaultBindings,
};
