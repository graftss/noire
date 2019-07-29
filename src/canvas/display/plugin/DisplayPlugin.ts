import * as T from '../../../types';
import { DisplayEventBus } from '../DisplayEventBus';

export class DisplayPlugin {
  constructor(protected config: T.NoireConfig, protected eb: DisplayEventBus) {}

  update(): void {}
}
