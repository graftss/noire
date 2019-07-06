import Konva from 'konva';

import * as T from '../../types';
import { Component } from '../../component';
import { DisplayPlugin } from './DisplayPlugin';
import { DisplayEventBus } from '../DisplayEventBus';

export class ComponentTransformerPlugin extends DisplayPlugin {
  transformer?: Konva.Transformer;
  transformerTarget?: Konva.Node;

  constructor(eventBus: DisplayEventBus) {
    super(eventBus);

    eventBus.on({ kind: 'stageClick', cb: this.onStageClick });
    eventBus.on({ kind: 'componentClick', cb: this.onComponentClick });
  }

  private onStageClick = (): void => {
    this.assignTransformer();
  };

  private onComponentClick = (component: Component): void => {
    this.assignTransformer(component.group);
  };

  private assignTransformer(target?: Konva.Node): void {
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
