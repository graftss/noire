import Konva from 'konva';
import { Texture } from '.';

export class BooleanFillTexture implements Texture<boolean> {
  constructor(private onColor: string, private offColor: string) {}

  apply(on: boolean, shape: Konva.Shape): void {
    shape.fill(on ? this.onColor : this.offColor);
  }
}
