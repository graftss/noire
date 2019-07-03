import Konva from 'konva';

import ComponentManager from './ComponentManager';

export default abstract class DisplayPlugin {
  stage: Konva.Stage;
  layer: Konva.Layer;
  cm: ComponentManager;

  constructor(stage: Konva.Stage, layer: Konva.Layer, cm: ComponentManager) {
    this.stage = stage;
    this.layer = layer;
    this.cm = cm;
  }
}
