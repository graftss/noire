import * as T from '../types';

export type EditorOption =
  | { kind: 'component'; id: Maybe<string> }
  | { kind: 'gamepad'; index: Maybe<number> }
  | { kind: 'controller'; id: Maybe<string> };

export type EditorAction =
  | { type: 'selectEditorOption'; data: EditorOption }
  | { type: 'updateControllerBindings'; data: T.ControllerBindingsUpdate }
  | { type: 'updateControllerName'; data: { id: string; name: string } }
  | { type: 'updateComponentKey'; data: T.ComponentKeyUpdate }
  | { type: 'updateComponentName'; data: { id: string; name: string } }
  | { type: 'listenNextInput'; data: T.RemapState }
  | { type: 'stopListening' };

export const selectEditorOption = (data: EditorOption): EditorAction => ({
  type: 'selectEditorOption',
  data,
});

export const updateControllerBindings = (
  update: T.ControllerBindingsUpdate,
): EditorAction => ({
  type: 'updateControllerBindings',
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

export const listenNextInput = (remapState: T.RemapState): EditorAction => ({
  type: 'listenNextInput',
  data: remapState,
});

export const stopListening = (): EditorAction => ({
  type: 'stopListening',
});
