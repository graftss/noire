import Konva from 'konva';
import * as T from '../../types';
import { Shape, ShapeState } from './Shape';

export interface RectangleState extends ShapeState {
  height: number;
  width: number;
}

export class Rectangle extends Shape {
  protected shape: Konva.Rect;
  protected state: RectangleState;

  constructor(state: RectangleState) {
    super(Rectangle.initShape(state), state);
  }

  private static initShape(state: RectangleState): Konva.Rect {
    const { x, y, width, height } = state;
    return new Konva.Rect({ x, y, width, height });
  }

  serialize(): T.SerializedShape {
    return { kind: 'rectangle', state: this.state };
  }
}
