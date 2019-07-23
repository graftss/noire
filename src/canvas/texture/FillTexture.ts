import { Shape } from '../shape/Shape';
import { Texture } from '.';

export class FillTexture implements Texture {
  constructor(private color: string) {}

  setColor(color: string): void {
    this.color = color;
  }

  apply(shape: Shape): void {
    shape.fillColor(this.color);
  }
}
