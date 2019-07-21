import Konva from 'konva';
import { Texture } from '.';

export class BooleanImageTexture implements Texture<boolean> {
  constructor(private image: HTMLImageElement) {}

  apply(input: boolean, shape: Konva.Shape): void {
    if (input) {
      shape.show();
      shape.fillPatternImage(this.image);
      shape.fillPatternOffset({ x: 300, y: 300 });
    } else {
      shape.hide();
    }
  }
}
