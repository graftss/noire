import Konva from 'konva';
import * as T from '../../types';
import { Component } from '../component/Component';
import { without } from '../../utils';

type ComponentId = string;

interface DisplayHandlerData {
  addComponent: Component;
  listenNextInput: T.RemapState;
  requestDraw: undefined;
  selectComponent: Maybe<ComponentId>;
  stageClick: Konva.Stage;
  updateComponentFilters: [ComponentId, T.ComponentFilterDict];
  updateComponentState: [ComponentId, T.ComponentState];
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
    stageClick: [],
    updateComponentFilters: [],
    updateComponentState: [],
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
