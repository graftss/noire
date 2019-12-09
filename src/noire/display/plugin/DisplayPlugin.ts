import * as T from '../../types';
import { Display } from '..';

export class DisplayPlugin {
  protected dispatch: T.Dispatch;

  constructor(protected config: T.NoireConfig, protected display: Display) {
    this.dispatch = display.store.dispatch;
  }

  update(): void {}

  emit = (event: T.DisplayEvent): void => this.display.eventBus.emit(event);
}
