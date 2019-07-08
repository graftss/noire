import * as T from '../types';

export type EditorAction =
  | { type: 'addBinding'; data: T.Binding }
  | { type: 'selectComponent'; data: string | undefined }
  | { type: 'selectGamepad'; data: number | undefined };

export const selectComponent = (componentId: string): EditorAction => ({
  type: 'selectComponent',
  data: componentId,
});

export const deselectComponent = (): EditorAction => ({
  type: 'selectComponent',
  data: undefined,
});

export const selectGamepad = (index: number): EditorAction => ({
  type: 'selectGamepad',
  data: index,
});

export const deselectGamepad = (): EditorAction => ({
  type: 'selectGamepad',
  data: undefined,
});
