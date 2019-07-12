import Konva from 'konva';
import { Component } from '../../component/Component';
import { DisplayEventBus } from '../DisplayEventBus';
import { DisplayPlugin } from './DisplayPlugin';

export class ComponentTransformerPlugin extends DisplayPlugin {
  transformer?: Konva.Transformer;
  transformerTarget?: Konva.Node;

  constructor(eventBus: DisplayEventBus) {
    super(eventBus);

    eventBus.on({ kind: 'stageClick', cb: this.onStageClick });
    eventBus.on({ kind: 'componentSelect', cb: this.onComponentSelect });
  }

  private onStageClick = (): void => {
    if (this.transformer) this.assignTransformer();
  };

  private onComponentSelect = (component: Component | undefined): void => {
    this.assignTransformer(component && component.group);
  };

  private assignTransformer(target?: Konva.Node): void {
    if (this.transformer) {
      this.transformer.destroy();
      this.transformerTarget.draggable(false);
    }

    if (target) {
      console.log(target);
      this.transformerTarget = target;
      this.transformer = new Konva.Transformer();
      this.transformer.attachTo(target);
      target.getLayer().add(this.transformer);

      target.draggable(true);
    }
  }
}
