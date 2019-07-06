import * as T from '../canvas/types';
import { EditorAction } from './types';

export const selectComponent = (component: T.Component): EditorAction => ({
  type: 'selectComponent',
  data: component.getBindingId(),
});

export const deselectComponent = (): EditorAction => ({
  type: 'selectComponent',
  data: undefined,
});
