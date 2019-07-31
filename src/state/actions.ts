import * as T from '../types';

export type EditorOption =
  | { kind: 'component'; id: Maybe<string> }
  | { kind: 'controller'; id: Maybe<string> };

export type EditorAction =
  | { type: 'emitDisplayEvents'; data: T.DisplayEvent[] }
  | { type: 'selectEditorOption'; data: EditorOption }
  | { type: 'startFullControllerUpdate' }
  | { type: 'updateControllerBinding'; data: T.ControllerBindingsUpdate }
  | { type: 'updateControllerName'; data: { id: string; name: string } }
  | {
      type: 'updateComponentState';
      data: { id: string; state: T.ComponentState };
    }
  | { type: 'listenNextInput'; data: T.RemapState }
  | { type: 'stopListening' }
  | { type: 'setTab'; data: T.TabKind };

export const emitDisplayEvents = (events: T.DisplayEvent[]): EditorAction => ({
  type: 'emitDisplayEvents',
  data: events,
});

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

export const updateComponentState = (
  id: string,
  state: T.ComponentState,
): EditorAction => ({
  type: 'updateComponentState',
  data: { id, state },
});

export const listenNextInput = (remapState: T.RemapState): EditorAction => ({
  type: 'listenNextInput',
  data: remapState,
});

export const stopListening = (): EditorAction => ({
  type: 'stopListening',
});

export const setTab = (kind: T.TabKind): EditorAction => ({
  type: 'setTab',
  data: kind,
});
