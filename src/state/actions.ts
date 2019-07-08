import * as T from '../types';

export type EditorAction =
  | { type: 'addBinding'; data: T.Binding }
  | { type: 'selectComponent'; data: string | undefined };

export const selectComponent = (componentId: string): EditorAction => ({
  type: 'selectComponent',
  data: componentId,
});

export const deselectComponent = (): EditorAction => ({
  type: 'selectComponent',
  data: undefined,
});
