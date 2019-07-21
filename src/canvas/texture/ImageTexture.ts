import { Shape } from '../shape/Shape';
import { Texture } from '.';

export class BooleanImageTexture implements Texture<boolean> {
  constructor(private image: HTMLImageElement) {}

  apply(input: boolean, shape: Shape): void {
    if (input) {
      shape.visibility(true);
      shape.fillImage(this.image);
      shape.offsetImage({ x: 300, y: 300 });
    } else {
      shape.visibility(false);
    }
  }
}
