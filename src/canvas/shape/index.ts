import * as T from '../../types';
import { Shape } from './Shape';
import { Rectangle } from './Rectangle';

export interface SerializedShape {
  kind: 'rectangle';
  state: T.RectangleState;
}

export const deserializeShape = (s: SerializedShape): Shape => {
  switch (s.kind) {
    case 'rectangle':
      return new Rectangle(s.state);
  }
};
