import * as T from '../../types';
import { Display } from '..';

export class DisplayPlugin {
  constructor(protected config: T.NoireConfig, protected display: Display) {}

  update(): void {}

  emit = (event: T.DisplayEvent): void => this.display.eventBus.emit(event);
}
