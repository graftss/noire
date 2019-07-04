import Konva from 'konva';

import Component from '.';
import { ButtonInput } from '../gamepad/inputMaps';

export default class ButtonComponent implements Component<ButtonInput> {
  group: Konva.Group;
  rect: Konva.Rect;

  fill: string = 'black';
  pressedFill: string = 'darkred';

  constructor(x, y) {
    this.group = new Konva.Group({ x, y });

    this.rect = new Konva.Rect({
      height: 20,
      width: 20,
      fill: 'black',
    });

    this.group.add(this.rect);
  }

  update({ pressed }: ButtonInput) {
    this.rect.fill(pressed ? this.pressedFill : this.fill);
  }
}
