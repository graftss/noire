import Konva from 'konva';

import ComponentManager from './ComponentManager';
import DisplayPlugin from './DisplayPlugin';

const CLICK_EVENT = 'click.addTransformer';

export default class ComponentTransformerPlugin extends DisplayPlugin {
  transformer?: Konva.Transformer;
  transformerTarget?: Konva.Node;

  constructor(stage: Konva.Stage, layer: Konva.Layer, cm: ComponentManager) {
    super(stage, layer, cm);

    cm.onAddedComponent(
      c => c.group.on(CLICK_EVENT, this.onComponentClick)
    );

    cm.onRemovedComponent(c => c.group.off(CLICK_EVENT));
  }

  onStageClick = ({ target, currentTarget }) => {
    if (target === this.stage) {
      this.assignTransformer();
    }
  }

  // TODO: add generic type for events like this
  onComponentClick = (e) => {
    this.assignTransformer(e.currentTarget);
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
