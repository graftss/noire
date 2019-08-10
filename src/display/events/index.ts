import Konva from 'konva';
import * as T from '../../types';
import { Texture } from '../texture/Texture';

export const addComponent = (component: T.Component): T.DisplayEvent => ({
  kind: 'addComponent',
  data: component,
});

export const listenNextInput = (remapState: T.RemapState): T.DisplayEvent => ({
  kind: 'listenNextInput',
  data: remapState,
});

export const requestDraw = (): T.DisplayEvent => ({
  kind: 'requestDraw',
  data: undefined,
});

export const selectComponent = (id?: string): T.DisplayEvent => ({
  kind: 'selectComponent',
  data: id,
});

export const selectModel = (id: string, modelName: string): T.DisplayEvent => ({
  kind: 'selectModel',
  data: { id, modelName },
});

export const konvaStageClick = (stage: Konva.Stage): T.DisplayEvent => ({
  kind: 'konvaStageClick',
  data: stage,
});

export const setComponentFilters = (
  id: string,
  filters: T.ComponentFilterDict,
): T.DisplayEvent => ({
  kind: 'setComponentFilters',
  data: { id, filters },
});

export const setComponentState = (
  id: string,
  state: T.ComponentState,
): T.DisplayEvent => ({
  kind: 'setComponentState',
  data: { id, state },
});

export const requestModelUpdate = (
  id: string,
  modelName: string,
  key: string,
  value: any,
): T.DisplayEvent => ({
  kind: 'requestModelUpdate',
  data: { id, modelName, key, value },
});

export const requestDefaultModel = (
  id: string,
  modelName: string,
  kind: T.KonvaModelKind,
): T.DisplayEvent => ({
  kind: 'requestDefaultModel',
  data: { id, modelName, kind },
});

export const setComponentModel = (
  id: string,
  modelName: string,
  model: T.KonvaModel,
): T.DisplayEvent => ({
  kind: 'setComponentModel',
  data: { id, modelName, model },
});

export const requestTextureUpdate = (
  id: string,
  textureName: string,
  key: string,
  value: any,
): T.DisplayEvent => ({
  kind: 'requestTextureUpdate',
  data: { id, textureName, key, value },
});

export const requestDefaultTexture = (
  id: string,
  textureName: string,
  kind: T.TextureKind,
): T.DisplayEvent => ({
  kind: 'requestDefaultTexture',
  data: { id, textureName, kind },
});

export const setComponentTexture = (
  id: string,
  textureName: string,
  texture: Texture,
): T.DisplayEvent => ({
  kind: 'setComponentTexture',
  data: { id, textureName, texture },
});

export const setKonvaTransformerVisibility = (
  visibility: boolean,
): T.DisplayEvent => ({
  kind: 'setKonvaTransformerVisibility',
  data: visibility,
});
