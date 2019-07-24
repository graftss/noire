import Konva from 'konva';
import * as T from '../../../types';
import { DisplayEventBus } from '../DisplayEventBus';
import { DisplayPlugin } from './DisplayPlugin';

export class KonvaComponentPlugin extends DisplayPlugin {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  constructor(config: T.NoireConfig, eb: DisplayEventBus) {
    super(config, eb);
    const { canvasTarget, width, height } = config;

    this.stage = new Konva.Stage({
      width,
      height,
      container: canvasTarget,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.stage.on('click', ({ target, currentTarget }) => {
      if (target === currentTarget) {
        this.eb.emit({
          kind: 'stageClick',
          data: [this.stage],
        });
      }
    });

    this.eb.on({
      kind: 'componentAdd',
      cb: (component: T.Component) => {
        const { shapes } = component.graphics;

        for (const key in component.graphics.shapes) {
          this.layer.add(shapes[key]);
        }
      },
    });

    this.eb.on({
      kind: 'requestDraw',
      cb: () => {
        this.layer.draw();
      },
    });
  }
}
