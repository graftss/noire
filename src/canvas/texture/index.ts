import Konva from 'konva';

export interface Texture<I> {
  apply: (input: I, shape: Konva.Shape) => void;
}
