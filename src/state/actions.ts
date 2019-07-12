import * as T from '../types';

export type EditorAction =
  | { type: 'selectComponent'; data: string | undefined }
  | { type: 'selectGamepad'; data: number | undefined }
  | { type: 'selectController'; data: string | undefined }
  | { type: 'listenNextInput'; data: T.RemapState }
  | { type: 'stopListening' };

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

export const selectController = (id: string): EditorAction => ({
  type: 'selectController',
  data: id,
});

export const listenNextInput = (remapState: T.RemapState): EditorAction => ({
  type: 'listenNextInput',
  data: remapState,
});

export const stopListening = (): EditorAction => ({
  type: 'stopListening',
});
