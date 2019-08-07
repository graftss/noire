import * as T from '../types';

export type EditorAction =
  | { type: 'emitDisplayEvents'; data: T.DisplayEvent[] }
  | { type: 'selectComponent'; data: Maybe<string> }
  | { type: 'selectController'; data: Maybe<string> }
  | { type: 'startFullControllerUpdate' }
  | { type: 'updateControllerBinding'; data: T.ControllerBindingUpdate }
  | { type: 'updateControllerName'; data: { id: string; name: string } }
  | {
      type: 'updateComponentState';
      data: { id: string; state: T.ComponentState };
    }
  | {
      type: 'updateComponentFilters';
      data: { id: string; filters: T.SerializedComponentFilterDict };
    }
  | {
      type: 'updateComponentModel';
      data: { id: string; modelName: string; model: T.SerializedKonvaModel };
    }
  | {
      type: 'updateComponentTexture';
      data: { id: string; textureName: string; texture: T.SerializedTexture };
    }
  | { type: 'toggleKonvaTransformer' }
  | { type: 'listenNextInput'; data: T.RemapState }
  | { type: 'stopListening' }
  | { type: 'setTab'; data: T.TabKind }
  | { type: 'enterPresentationMode' }
  | { type: 'closePresentationSnackbar' }
  | { type: 'exitPresentationMode' };

export const emitDisplayEvents = (events: T.DisplayEvent[]): EditorAction => ({
  type: 'emitDisplayEvents',
  data: events,
});

export const selectController = (id?: string): EditorAction => ({
  type: 'selectController',
  data: id,
});

export const selectComponent = (id?: string): EditorAction => ({
  type: 'selectComponent',
  data: id,
});

export const startFullControllerUpdate = (): EditorAction => ({
  type: 'startFullControllerUpdate',
});

export const updateControllerBinding = (
  update: T.ControllerBindingUpdate,
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

export const updateComponentModel = (
  id: string,
  modelName: string,
  model: T.SerializedKonvaModel,
): EditorAction => ({
  type: 'updateComponentModel',
  data: { id, modelName, model },
});

export const updateComponentTexture = (
  id: string,
  textureName: string,
  texture: T.SerializedTexture,
): EditorAction => ({
  type: 'updateComponentTexture',
  data: { id, textureName, texture },
});

export const toggleKonvaTransformer = (): EditorAction => ({
  type: 'toggleKonvaTransformer',
});

export const updateComponentFilters = (
  id: string,
  filters: T.SerializedComponentFilterDict,
): EditorAction => ({
  type: 'updateComponentFilters',
  data: { id, filters },
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

export const enterPresentationMode = (): EditorAction => ({
  type: 'enterPresentationMode',
});

export const closePresentationSnackbar = (): EditorAction => ({
  type: 'closePresentationSnackbar',
});

export const exitPresentationMode = (): EditorAction => ({
  type: 'exitPresentationMode',
});
