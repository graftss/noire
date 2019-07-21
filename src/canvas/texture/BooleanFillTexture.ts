import { Shape } from '../shape/Shape';
import { Texture } from '.';

export class BooleanFillTexture implements Texture<boolean> {
  constructor(private onColor: string, private offColor: string) {}

  apply(on: boolean, shape: Shape): void {
    shape.fillColor(on ? this.onColor : this.offColor);
  }
}
