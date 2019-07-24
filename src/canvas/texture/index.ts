import Konva from 'konva';

export interface Texture {
  apply: (shape: Konva.Shape) => void;
}
