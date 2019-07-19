import * as T from '../../../types';
import { shallowCloneObj } from '../../../utils';

const SHIFT = 16;
const CTRL = 17;
const ALT = 18;
const META = 91;

export class Keyboard {
  private state: T.KeyboardState = {};
  private listenedKeyCodeMap: Record<number, boolean> = {};

  constructor(listenedKeyCodes: number[]) {
    listenedKeyCodes.forEach(c => {
      this.listenedKeyCodeMap[c] = true;
      this.state[c] = false;
    });
  }

  private update(e: KeyboardEvent, down: boolean): void {
    if (this.listenedKeyCodeMap[e.keyCode]) {
      this.state[e.keyCode] = down;
      this.state[SHIFT] = e.shiftKey;
      this.state[CTRL] = e.ctrlKey;
      this.state[ALT] = e.altKey;
      this.state[META] = e.metaKey;
    }
  }

  onKeyDown = (e: KeyboardEvent): void => {
    this.update(e, true);
  };

  onKeyUp = (e: KeyboardEvent): void => {
    this.update(e, false);
  };

  isDown = (keyCode: number): boolean => {
    return this.state[keyCode];
    // && this.state[SHIFT] === key.shift
    // && this.state[CTRL] === key.ctrl
    // && this.state[ALT] === key.alt
    // && this.state[META] === key.meta;
  };

  getButtonSnapshot = (): T.KeyboardInputSnapshot['button'] => {
    return shallowCloneObj(this.state);
  };
}
