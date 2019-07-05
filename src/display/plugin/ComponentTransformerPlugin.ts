import Konva from 'konva';

import * as T from '../../types';
import { ComponentManager } from '../ComponentManager';
import { DisplayPlugin } from './DisplayPlugin';
import { DisplayEventBus } from '../DisplayEventBus';

const CLICK_EVENT = 'click.ComponentTransformerPlugin';

export class ComponentTransformerPlugin extends DisplayPlugin {
  transformer?: Konva.Transformer;
  transformerTarget?: Konva.Node;

  constructor(eventBus: DisplayEventBus) {
    super(eventBus);

    eventBus.on({ kind: 'stageClick', cb: this.onStageClick });
    eventBus.on({ kind: 'componentClick', cb: this.onComponentClick });
  }

  onStageClick = (stage: Konva.Stage) => {
    this.assignTransformer();
  }

  onComponentClick = (data: T.ComponentData) => {
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
      target.getLayer().add(this.transformer);

      target.draggable(true);
    }
  }
}
