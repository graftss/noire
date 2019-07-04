import Konva from 'konva';

import ComponentManager from '../ComponentManager';

export default abstract class DisplayPlugin {
  constructor(
    protected stage: Konva.Stage,
    protected layer: Konva.Layer,
    protected cm: ComponentManager,
  ) {}
}
