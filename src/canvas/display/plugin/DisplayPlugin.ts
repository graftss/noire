import * as T from '../../../types';
import { DisplayEventBus } from '../DisplayEventBus';
import { ComponentManager } from '../ComponentManager';

export class DisplayPlugin {
  constructor(
    protected config: T.NoireConfig,
    protected eventBus: DisplayEventBus,
    protected cm: ComponentManager,
  ) {}

  update(): void {}
}
