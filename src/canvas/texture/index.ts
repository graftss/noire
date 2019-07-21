import { Shape } from '../shape/Shape';

export interface Texture<I> {
  apply: (input: I, shape: Shape) => void;
}
