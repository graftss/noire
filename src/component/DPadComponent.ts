import Konva from 'konva';

import Component from '.';
import { ButtonInput } from '../map/ButtonMap';
import { DPadInput, DPadDict } from '../map/DPadMap';

const dirs = ['u', 'l', 'd', 'r'];

export default class DPadComponent implements Component<DPadInput> {
  group: Konva.Group;
  rects: DPadDict<Konva.Rect>;

  fill: string = 'black';
  pressedFill: string = 'darkred';

  constructor(x, y, bw, bh) {
    this.group = new Konva.Group({ x, y });

    this.rects = {
      u: new Konva.Rect({ x: 0, y: -bh, width: bw, height: bh }),
      l: new Konva.Rect({ x: -bw, y: 0, width: bw, height: bh }),
      d: new Konva.Rect({ x: 0, y: bh, width: bw, height: bh }),
      r: new Konva.Rect({ x: bw, y: 0, width: bw, height: bh }),
    };

    dirs.forEach(dir => this.group.add(this.rects[dir]));
  }

  update(input: DPadInput) {
    const { pressedFill, fill } = this;
    dirs.forEach(dir => {
      this.rects[dir].fill(input[dir].pressed ? pressedFill : fill);
    });
  }
}
