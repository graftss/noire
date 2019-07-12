import * as T from '../types';

export type EditorOption =
  | { kind: 'component'; id: string | undefined }
  | { kind: 'gamepad'; index: number | undefined }
  | { kind: 'controller'; id: string | undefined };

export type EditorAction =
  | { type: 'selectEditorOption'; data: EditorOption }
  | { type: 'bindControllerKey'; data: T.ControllerKeyBinding }
  | { type: 'listenNextInput'; data: T.RemapState }
  | { type: 'stopListening' };

export const selectEditorOption = (data: EditorOption): EditorAction => ({
  type: 'selectEditorOption',
  data,
});

export const bindControllerKey = (
  data: T.ControllerKeyBinding,
): EditorAction => ({
  type: 'bindControllerKey',
  data,
});

export const listenNextInput = (remapState: T.RemapState): EditorAction => ({
  type: 'listenNextInput',
  data: remapState,
});

export const stopListening = (): EditorAction => ({
  type: 'stopListening',
});
