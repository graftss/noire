import Konva from 'konva';
import { vec2 } from '../../utils';
import { Texture } from '.';

export class ImageTexture implements Texture {
  constructor(private image: HTMLImageElement, private offset: Vec2) {}

  moveBy = (v: Vec2): void => {
    this.offset = vec2.add(this.offset, v);
  };

  moveTo = (v: Vec2): void => {
    this.offset = v;
  };

  apply(shape: Konva.Shape): void {
    shape.fillPatternImage(this.image);
    shape.fillPatternOffset(this.offset);
  }
}
