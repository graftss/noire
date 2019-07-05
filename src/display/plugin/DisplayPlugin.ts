import Konva from 'konva';

import { DisplayEventBus } from '../DisplayEventBus';

export abstract class DisplayPlugin {
  constructor(
    protected eventBus: DisplayEventBus,
  ) {}
}
