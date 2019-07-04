import Konva from 'konva';

import ComponentManager, { ComponentData } from '../ComponentManager';
import DisplayPlugin from './DisplayPlugin';

const CLICK_EVENT = 'click.ComponentTransformerPlugin';

export default class ComponentTransformerPlugin extends DisplayPlugin {
  transformer?: Konva.Transformer;
  transformerTarget?: Konva.Node;

  constructor(stage: Konva.Stage, layer: Konva.Layer, cm: ComponentManager) {
    super(stage, layer, cm);

    stage.on(CLICK_EVENT, this.onStageClick);

    cm.onComponentClick(this.onComponentClick);
  }

  onStageClick = ({ target, currentTarget }) => {
    if (target === this.stage) {
      this.assignTransformer();
    }
  }

  onComponentClick = (data: ComponentData) => {
    this.assignTransformer(data.component.group);
  }

  assignTransformer(target?: Konva.Node) {
    if (this.transformer) {
      this.transformer.destroy();
      this.transformerTarget.draggable(false);
    }

    if (target) {
      this.transformerTarget = target;
      this.transformer = new Konva.Transformer();
      this.transformer.attachTo(target);
      this.layer.add(this.transformer);

      target.draggable(true);
    }
  }
}
