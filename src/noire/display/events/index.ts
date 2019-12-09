import Konva from 'konva';
import * as T from '../../types';
import { Texture } from '../texture/Texture';

export const requestUpdateDisplayField = (
  display: T.SerializedDisplay,
  field: T.DisplayField,
): T.DisplayEvent<'requestUpdateDisplayField'> => ({
  kind: 'requestUpdateDisplayField',
  data: { display, field },
});

export const requestClearDisplay = (): T.DisplayEvent<
  'requestClearDisplay'
> => ({
  kind: 'requestClearDisplay',
  data: undefined,
});

export const requestLoadDisplay = (
  display: T.SerializedDisplay,
): T.DisplayEvent<'requestLoadDisplay'> => ({
  kind: 'requestLoadDisplay',
  data: display,
});

export const requestAddComponent = (
  component: T.Component,
): T.DisplayEvent<'requestAddComponent'> => ({
  kind: 'requestAddComponent',
  data: component,
});

export const addComponent = (
  component: T.Component,
): T.DisplayEvent<'addComponent'> => ({
  kind: 'addComponent',
  data: component,
});

export const requestRemoveComponent = (
  id: string,
): T.DisplayEvent<'requestRemoveComponent'> => ({
  kind: 'requestRemoveComponent',
  data: id,
});

export const removeComponent = (
  component: T.Component,
): T.DisplayEvent<'removeComponent'> => ({
  kind: 'removeComponent',
  data: component,
});

export const listenNextInput = (
  remapState: T.RemapState,
): T.DisplayEvent<'listenNextInput'> => ({
  kind: 'listenNextInput',
  data: remapState,
});

export const requestDraw = (): T.DisplayEvent<'requestDraw'> => ({
  kind: 'requestDraw',
  data: undefined,
});

export const requestSelectComponent = (
  id: string,
): T.DisplayEvent<'requestSelectComponent'> => ({
  kind: 'requestSelectComponent',
  data: id,
});

export const selectComponent = (
  id: string,
): T.DisplayEvent<'selectComponent'> => ({
  kind: 'selectComponent',
  data: id,
});

export const requestDeselectComponent = (
  id: string,
): T.DisplayEvent<'requestDeselectComponent'> => ({
  kind: 'requestDeselectComponent',
  data: id,
});

export const deselectComponent = (
  id: string,
): T.DisplayEvent<'deselectComponent'> => ({
  kind: 'deselectComponent',
  data: id,
});

export const selectModel = (
  id: string,
  modelName: string,
): T.DisplayEvent<'selectModel'> => ({
  kind: 'selectModel',
  data: { id, modelName },
});

export const konvaStageClick = (
  stage: Konva.Stage,
): T.DisplayEvent<'konvaStageClick'> => ({
  kind: 'konvaStageClick',
  data: stage,
});

export const setComponentState = (
  id: string,
  state: T.ComponentState,
): T.DisplayEvent<'setComponentState'> => ({
  kind: 'setComponentState',
  data: { id, state },
});

export const requestModelUpdate = (
  id: string,
  modelName: string,
  serializedModel: T.SerializedKonvaModel,
): T.DisplayEvent<'requestModelUpdate'> => ({
  kind: 'requestModelUpdate',
  data: { id, modelName, serializedModel },
});

export const requestDefaultModel = (
  id: string,
  modelName: string,
  kind: T.KonvaModelKind,
): T.DisplayEvent<'requestDefaultModel'> => ({
  kind: 'requestDefaultModel',
  data: { id, modelName, kind },
});

export const setComponentModel = (
  id: string,
  modelName: string,
  model: T.KonvaModel,
): T.DisplayEvent<'setComponentModel'> => ({
  kind: 'setComponentModel',
  data: { id, modelName, model },
});

export const requestTextureUpdate = (
  id: string,
  textureName: string,
  texture: T.SerializedTexture,
): T.DisplayEvent<'requestTextureUpdate'> => ({
  kind: 'requestTextureUpdate',
  data: { id, textureName, texture },
});

export const requestDefaultTexture = (
  id: string,
  textureName: string,
  kind: T.TextureKind,
): T.DisplayEvent<'requestDefaultTexture'> => ({
  kind: 'requestDefaultTexture',
  data: { id, textureName, kind },
});

export const setComponentTexture = (
  id: string,
  textureName: string,
  texture: Texture,
): T.DisplayEvent<'setComponentTexture'> => ({
  kind: 'setComponentTexture',
  data: { id, textureName, texture },
});

export const setComponentFilters = (
  id: string,
  filters: T.ComponentFilters,
): T.DisplayEvent<'setComponentFilters'> => ({
  kind: 'setComponentFilters',
  data: { id, filters },
});

export const requestFilterUpdate = (
  id: string,
  ref: T.ComponentFilterRef,
  filter: T.InputFilter,
): T.DisplayEvent<'requestFilterUpdate'> => ({
  kind: 'requestFilterUpdate',
  data: { id, ref, filter },
});

export const requestRemoveFilter = (
  id: string,
  ref: T.ComponentFilterRef,
): T.DisplayEvent<'requestRemoveFilter'> => ({
  kind: 'requestRemoveFilter',
  data: { id, ref },
});

export const setTransformerVisibility = (
  visibility: boolean,
): T.DisplayEvent<'setTransformerVisibility'> => ({
  kind: 'setTransformerVisibility',
  data: visibility,
});
