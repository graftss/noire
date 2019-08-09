import Konva from 'konva';
import * as T from '../types';
import { without } from '../utils';
import { Component } from './component/Component';
import { Texture } from './texture/Texture';

type ComponentId = string;
type ModelName = string;
type ModelKey = string;
type ModelValue = any;
type TextureName = string;
type TextureKey = string;
type TextureValue = any;

interface DisplayHandlerData {
  addComponent: Component;
  listenNextInput: T.RemapState;
  requestDraw: undefined;
  selectComponent: Maybe<string>;
  selectModel: { id: string; modelName: string };
  stageClick: Konva.Stage;
  updateComponentFilters: { id: string; filters: T.ComponentFilterDict };
  updateComponentState: { id: string; state: T.ComponentState };
  requestUpdateComponentModel: {
    id: string;
    modelName: string;
    key: string;
    value: any;
  };
  requestDefaultComponentModel: {
    id: string;
    modelName: string;
    kind: T.KonvaModelKind;
  };
  updateComponentModel: { id: string; modelName: string; model: T.KonvaModel };
  requestUpdateComponentTexture: {
    id: string;
    textureName: string;
    key: string;
    value: any;
  };
  requestDefaultComponentTexture: {
    id: string;
    textureName: string;
    kind: T.TextureKind;
  };
  updateComponentTexture: { id: string; textureName: string; texture: Texture };
  setKonvaTransformerVisibility: boolean;
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
    addComponent: [],
    listenNextInput: [],
    requestDraw: [],
    selectComponent: [],
    selectModel: [],
    stageClick: [],
    updateComponentFilters: [],
    updateComponentState: [],
    requestUpdateComponentModel: [],
    requestDefaultComponentModel: [],
    updateComponentModel: [],
    requestUpdateComponentTexture: [],
    requestDefaultComponentTexture: [],
    updateComponentTexture: [],
    setKonvaTransformerVisibility: [],
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
