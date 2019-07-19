import * as T from '../../types';

const lower = "qwertyuiopasdfghjklzxcvbnm1234567890,.;'[]/";
const upper = 'QWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*()<>:"{}?';
const letters = lower + upper;

export const keyboardMap: Dict<T.ControllerKeyData> = letters
  .split('')
  .map(l => ({ name: l, inputKind: 'button', key: l }))
  .reduce((map, v: T.ControllerKeyData, k) => ({ ...map, [k]: v }), {});

export type KeyboardControllerClass = T.BaseControllerClass & {
  kind: 'keyboard';
};

export type KeyboardController = T.BaseController<KeyboardControllerClass>;
