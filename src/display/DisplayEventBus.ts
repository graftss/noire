import Konva from 'konva';
import * as T from '../types';
import { without } from '../utils';
import { Component } from './component/Component';

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
  selectComponent: Maybe<ComponentId>;
  selectModel: [Maybe<ComponentId>, ModelName];
  stageClick: Konva.Stage;
  updateComponentFilters: [ComponentId, T.ComponentFilterDict];
  updateComponentState: [ComponentId, T.ComponentState];
  requestUpdateComponentModel: [ComponentId, ModelName, ModelKey, ModelValue];
  updateComponentModel: [ComponentId, ModelName, Konva.Shape];
  requestUpdateComponentTexture: [
    ComponentId,
    TextureName,
    TextureKey,
    TextureValue,
  ];
  requestDefaultComponentTexture: [ComponentId, TextureName, T.TextureKind];
  updateComponentTexture: [ComponentId, TextureName, T.Texture];
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
