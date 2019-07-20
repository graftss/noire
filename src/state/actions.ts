import * as T from '../types';

export type EditorOption =
  | { kind: 'component'; id: Maybe<string> }
  | { kind: 'controller'; id: Maybe<string> };

export type EditorAction =
  | { type: 'selectEditorOption'; data: EditorOption }
  | { type: 'startFullControllerUpdate' }
  | { type: 'updateControllerBinding'; data: T.ControllerBindingsUpdate }
  | { type: 'updateControllerName'; data: { id: string; name: string } }
  | { type: 'updateComponentKey'; data: T.ComponentKeyUpdate }
  | { type: 'updateComponentName'; data: { id: string; name: string } }
  | { type: 'addComponent'; data: T.ComponentKind }
  | { type: 'listenNextInput'; data: T.RemapState }
  | { type: 'stopListening' };

export const selectEditorOption = (data: EditorOption): EditorAction => ({
  type: 'selectEditorOption',
  data,
});

export const startFullControllerUpdate = (): EditorAction => ({
  type: 'startFullControllerUpdate',
});

export const updateControllerBinding = (
  update: T.ControllerBindingsUpdate,
): EditorAction => ({
  type: 'updateControllerBinding',
  data: update,
});

export const updateControllerName = (
  id: string,
  name: string,
): EditorAction => ({
  type: 'updateControllerName',
  data: { id, name },
});

export const updateComponentKey = (
  update: T.ComponentKeyUpdate,
): EditorAction => ({
  type: 'updateComponentKey',
  data: update,
});

export const updateComponentName = (
  id: string,
  name: string,
): EditorAction => ({
  type: 'updateComponentName',
  data: { id, name },
});

export const addComponent = (kind: T.ComponentKind): EditorAction => ({
  type: 'addComponent',
  data: kind,
});

export const listenNextInput = (remapState: T.RemapState): EditorAction => ({
  type: 'listenNextInput',
  data: remapState,
});

export const stopListening = (): EditorAction => ({
  type: 'stopListening',
});
