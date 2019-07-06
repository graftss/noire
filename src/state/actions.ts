import * as T from '../types';

export const selectComponent = (componentId: string): T.EditorAction => ({
  type: 'selectComponent',
  data: componentId,
});

export const deselectComponent = (): T.EditorAction => ({
  type: 'selectComponent',
  data: undefined,
});
