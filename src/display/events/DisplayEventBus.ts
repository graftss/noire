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

interface DisplayHandlerData {
  addComponent: Component;
  listenNextInput: T.RemapState;
  requestDraw: undefined;
  selectComponent: Maybe<string>;
  selectModel: { id: string; modelName: string };
  konvaStageClick: Konva.Stage;
  setComponentState: { id: string; state: T.ComponentState };
  requestModelUpdate: {
    id: string;
    modelName: string;
    key: string;
    value: any;
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
    key: string;
    value: any;
  };
  requestDefaultTexture: {
    id: string;
    textureName: string;
    kind: T.TextureKind;
  };
  setComponentTexture: { id: string; textureName: string; texture: Texture };
  setComponentFilters: { id: string; filters: T.ComponentFilterDict };
  requestFilterUpdate: {
    id: string;
    modelName: string;
    filterIndex: number;
    key: string;
    value: any;
  };
  requestDefaultFilter: {
    id: string;
    modelName: string;
    filterIndex: number;
    kind: T.InputFilterKind;
  };
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
