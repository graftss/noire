import { Shape } from '../shape/Shape';

export interface Texture {
  apply: (shape: Shape) => void;
}
