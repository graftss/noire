import Konva from 'konva';
import * as T from '../../types';
import { without } from '../../utils';
import { Component } from '../component/Component';
import { Texture } from '../texture/Texture';

type ComponentId = string;
type ModelName = string;
type ModelKey = string;
type ModelValue = any;
type TextureName = string;
type TextureKey = string;
type TextureValue = any;

export interface DisplayHandlerData {
  requestAddComponent: T.Component;
  addComponent: Component;
  requestRemoveComponent: string;
  removeComponent: string;
  listenNextInput: T.RemapState;
  requestDraw: undefined;
  requestSelectComponent: string;
  selectComponent: string;
  requestDeselectComponent: string;
  deselectComponent: string;
  selectModel: { id: string; modelName: string };
  konvaStageClick: Konva.Stage;
  setComponentState: { id: string; state: T.ComponentState };
  requestModelUpdate: {
    id: string;
    modelName: string;
    serializedModel: T.SerializedKonvaModel;
  };
  requestDefaultModel: {
    id: string;
    modelName: string;
    kind: T.KonvaModelKind;
  };
  setComponentModel: { id: string; modelName: string; model: T.KonvaModel };
  requestTextureUpdate: {
    id: string;
    textureName: string;
    texture: T.SerializedTexture;
  };
  requestDefaultTexture: {
    id: string;
    textureName: string;
    kind: T.TextureKind;
  };
  setComponentTexture: { id: string; textureName: string; texture: Texture };
  setComponentFilters: { id: string; filters: T.ComponentFilters };
  requestFilterUpdate: {
    id: string;
    ref: T.ComponentFilterRef;
    filter: T.InputFilter;
  };
  requestDefaultFilter: {
    id: string;
    ref: T.ComponentFilterRef;
    kind: T.InputFilterKind;
  };
  setTransformerVisibility: boolean;
}

export type DisplayEventKind = keyof DisplayHandlerData;

type DisplayEventCallback<K extends DisplayEventKind = DisplayEventKind> = (
  data: DisplayHandlerData[K],
) => void;

export interface DisplayEventHandler<
  K extends DisplayEventKind = DisplayEventKind
> {
  kind: K;
  cb: DisplayEventCallback<K>;
}

export interface DisplayEvent<K extends DisplayEventKind = DisplayEventKind> {
  kind: K;
  data: DisplayHandlerData[K];
}

type AllDisplayEventCallbacks = {
  [K in DisplayEventKind]: DisplayEventCallback<K>[];
};

export class DisplayEventBus {
  private callbacks: AllDisplayEventCallbacks = {
    requestAddComponent: [],
    addComponent: [],
    requestRemoveComponent: [],
    removeComponent: [],
    listenNextInput: [],
    requestDraw: [],
    requestSelectComponent: [],
    selectComponent: [],
    requestDeselectComponent: [],
    deselectComponent: [],
    selectModel: [],
    konvaStageClick: [],
    setComponentState: [],
    requestModelUpdate: [],
    requestDefaultModel: [],
    setComponentModel: [],
    requestTextureUpdate: [],
    requestDefaultTexture: [],
    setComponentTexture: [],
    requestFilterUpdate: [],
    requestDefaultFilter: [],
    setComponentFilters: [],
    setTransformerVisibility: [],
  };

  emit = <K extends DisplayEventKind>(event: DisplayEvent<K>): void => {
    this.callbacks[event.kind].forEach(cb => cb(event.data));
  };

  on = <K extends DisplayEventKind>(handler: DisplayEventHandler<K>): void => {
    const cbs = this.callbacks[handler.kind] as DisplayEventCallback<K>[];
    cbs.push(handler.cb);
  };

  off = <K extends DisplayEventKind>(handler: DisplayEventHandler<K>): void => {
    const cbs = this.callbacks[handler.kind] as DisplayEventCallback<K>[];
    without(handler.cb, cbs);
  };
}
