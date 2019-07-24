import Konva from 'konva';
import { Texture } from '.';

export class FillTexture implements Texture {
  constructor(private color: string) {}

  setColor(color: string): void {
    this.color = color;
  }

  apply(shape: Konva.Shape): void {
    shape.fill(this.color);
  }
}
