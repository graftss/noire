import Konva from 'konva';
import { GroupContainer } from '../../component';
import { Component } from '../../component/Component';
import { DisplayEventBus } from '../DisplayEventBus';
import { cast } from '../../../utils';
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
    this.assignTransformer();
  };

  private onComponentSelect = (component: Maybe<Component>): void => {
    const gc: Maybe<Component & GroupContainer> = cast(
      c => c && c.group,
      component,
    );
    if (gc) {
      this.assignTransformer(gc.group);
    } else {
      this.assignTransformer();
    }
  };

  private assignTransformer(target?: Konva.Node): void {
    if (this.transformer && this.transformerTarget) {
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
