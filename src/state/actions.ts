import * as T from '../canvas/types';
import { EditorAction } from './types';

export const selectComponent = (componentId: string): EditorAction => ({
  type: 'selectComponent',
  data: componentId,
});

export const deselectComponent = (): EditorAction => ({
  type: 'selectComponent',
  data: undefined,
});
