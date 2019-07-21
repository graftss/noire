import Konva from 'konva';

export interface ShapeState {
  x: number;
  y: number;
}

export class Shape {
  constructor(protected shape: Konva.Shape, protected state: ShapeState) {}

  addToGroup(group: Konva.Group): Shape {
    group.add(this.shape);
    return this;
  }

  visibility(show: boolean): Shape {
    show ? this.shape.show() : this.shape.hide();
    return this;
  }

  fillColor(color: string): Shape {
    this.shape.fill(color);
    return this;
  }

  fillImage(image: HTMLImageElement): Shape {
    this.shape.fillPatternImage(image);
    return this;
  }

  offsetImage(offset: Vec2): Shape {
    this.shape.fillPatternOffset(offset);
    return this;
  }
}
