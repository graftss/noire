import Konva from 'konva';

import DisplayEventBus from '../DisplayEventBus';

export default abstract class DisplayPlugin {
  constructor(
    protected eventBus: DisplayEventBus,
  ) {}
}
