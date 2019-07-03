import Konva from 'konva';

import Component from '.';

const ADD_TRANSFORMER_EVENT = 'addTransformer';

export default class ComponentManager {
  components: Component<any>[] = [];
  stage: Konva.Stage;
  layer: Konva.Layer;

  transformer?: Konva.Transformer;
  transformerTarget: Konva.Node;

  constructor(stage) {
    this.layer = new Konva.Layer();
    this.stage = stage;

    this.stage.on('click', this.onStageClick);

    stage.add(this.layer);
  }

  add(component: Component<any>) {
    this.components.push(component);
    this.layer.add(component.group);

    component.group.on(`click.${ADD_TRANSFORMER_EVENT}`, this.onComponentClick);
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

  remove(component: Component<any>) {
    const idx = this.components.indexOf(component);

    if (idx >= 0) {
      const component = this.components[idx];
      component.group.remove();

      this.components.splice(idx, 1);
    }
  }

  draw() {
    this.layer.draw();
  }
}
