import * as T from '../types';

export type EditorAction =
  | { type: 'emitDisplayEvents'; data: T.DisplayEvent[] }
  | { type: 'setCanvasDimensions'; data: { width: number; height: number } }
  | { type: 'addComponent'; data: T.SerializedComponent }
  | { type: 'removeComponent'; data: string }
  | { type: 'selectComponent'; data: string }
  | { type: 'deselectComponent'; data: string }
  | { type: 'selectController'; data: Maybe<string> }
  | { type: 'addController'; data: T.Controller }
  | { type: 'removeController'; data: string }
  | { type: 'startFullControllerUpdate' }
  | { type: 'updateControllerBinding'; data: T.ControllerBindingUpdate }
  | { type: 'updateControllerName'; data: { id: string; name: string } }
  | {
      type: 'setComponentState';
      data: { id: string; state: T.ComponentState };
    }
  | {
      type: 'setComponentInputFilter';
      data: {
        id: string;
        ref: T.ComponentFilterRef;
        filter: T.InputFilter;
      };
    }
  | {
      type: 'removeComponentInputFilter';
      data: { id: string; ref: T.ComponentFilterRef };
    }
  | {
      type: 'setComponentModel';
      data: { id: string; modelName: string; model: T.SerializedKonvaModel };
    }
  | {
      type: 'setComponentTexture';
      data: { id: string; textureName: string; texture: T.SerializedTexture };
    }
  | { type: 'toggleKonvaTransformer' }
  | { type: 'listenNextInput'; data: T.RemapState }
  | { type: 'stopListening' }
  | { type: 'setTab'; data: T.TabKind }
  | { type: 'enterPresentationMode' }
  | { type: 'closePresentationSnackbar' }
  | { type: 'exitPresentationMode' }
  | { type: 'saveDisplay'; data: T.SerializedDisplay }
  | { type: 'selectDisplay'; data: T.SerializedDisplay }
  | { type: 'removeDisplay'; data: string };

export const setCanvasDimensions = (
  width: number,
  height: number,
): EditorAction => ({
  type: 'setCanvasDimensions',
  data: { width, height },
});

export const emitDisplayEvents = (events: T.DisplayEvent[]): EditorAction => ({
  type: 'emitDisplayEvents',
  data: events,
});

export const addComponent = (
  component: T.SerializedComponent,
): EditorAction => ({
  type: 'addComponent',
  data: component,
});

export const removeComponent = (id: string): EditorAction => ({
  type: 'removeComponent',
  data: id,
});

export const selectController = (id?: string): EditorAction => ({
  type: 'selectController',
  data: id,
});

export const addController = (controller: T.Controller): EditorAction => ({
  type: 'addController',
  data: controller,
});

export const removeController = (id: string): EditorAction => ({
  type: 'removeController',
  data: id,
});

export const selectComponent = (id: string): EditorAction => ({
  type: 'selectComponent',
  data: id,
});

export const deselectComponent = (id: string): EditorAction => ({
  type: 'deselectComponent',
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

export const setComponentState = (
  id: string,
  state: T.ComponentState,
): EditorAction => ({
  type: 'setComponentState',
  data: { id, state },
});

export const setComponentModel = (
  id: string,
  modelName: string,
  model: T.SerializedKonvaModel,
): EditorAction => ({
  type: 'setComponentModel',
  data: { id, modelName, model },
});

export const setComponentTexture = (
  id: string,
  textureName: string,
  texture: T.SerializedTexture,
): EditorAction => ({
  type: 'setComponentTexture',
  data: { id, textureName, texture },
});

export const toggleKonvaTransformer = (): EditorAction => ({
  type: 'toggleKonvaTransformer',
});

export const setComponentInputFilter = (
  id: string,
  ref: T.ComponentFilterRef,
  filter: T.InputFilter,
): EditorAction => ({
  type: 'setComponentInputFilter',
  data: { id, ref, filter },
});

export const removeComponentInputFilter = (
  id: string,
  ref: T.ComponentFilterRef,
): EditorAction => ({
  type: 'removeComponentInputFilter',
  data: { id, ref },
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

export const saveDisplay = (display: T.SerializedDisplay): EditorAction => ({
  type: 'saveDisplay',
  data: display,
});

export const selectDisplay = (display: T.SerializedDisplay): EditorAction => ({
  type: 'selectDisplay',
  data: display,
});

export const removeDisplay = (id: string): EditorAction => ({
  type: 'removeDisplay',
  data: id,
});
