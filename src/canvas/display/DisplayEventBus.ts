import Konva from 'konva';
import * as T from '../../types';
import { Component } from '../component/Component';
import { without } from '../../utils';

type ComponentState = T.TypedComponentState<Dict<T.Input>>;

export type Handler =
  | { kind: 'listenNextInput'; cb: CB1<T.RemapState> }
  | { kind: 'stageClick'; cb: CB1<Konva.Stage> }
  | { kind: 'componentUpdateState'; cb: CB2<string, ComponentState> }
  | {
      kind: 'componentUpdateFilterKey';
      cb: CB2<string, T.ComponentFilterDict>;
    }
  | { kind: 'componentSelect'; cb: CB1<Maybe<string>> }
  | { kind: 'componentAdd'; cb: CB1<Component> }
  | { kind: 'bindingAdd'; cb: CB2<Component, T.Binding> }
  | { kind: 'requestDraw'; cb: CB0 };

export type DisplayEvent =
  | { kind: 'listenNextInput'; data: [T.RemapState] }
  | { kind: 'stageClick'; data: [Konva.Stage] }
  | { kind: 'componentUpdateState'; data: [string, ComponentState] }
  | {
      kind: 'componentUpdateFilterKey';
      data: [string, T.ComponentFilterDict];
    }
  | { kind: 'componentSelect'; data: [Maybe<string>] }
  | { kind: 'componentAdd'; data: [Component] }
  | { kind: 'bindingAdd'; data: [Component, T.Binding] }
  | { kind: 'requestDraw'; data?: undefined };

export class DisplayEventBus {
  private handlers: Record<Handler['kind'], Function[]> = {
    listenNextInput: [],
    stageClick: [],
    componentUpdateState: [],
    componentUpdateFilterKey: [],
    componentSelect: [],
    componentAdd: [],
    bindingAdd: [],
    requestDraw: [],
  };

  emit = (event: DisplayEvent): void => {
    const eventHandlers = this.handlers[event.kind];

    if (eventHandlers) {
      const args = event.data || [];
      eventHandlers.forEach(cb => cb(...args));
    }
  };

  on = (handler: Handler): void => {
    const eventHandlers = this.handlers[handler.kind];

    if (eventHandlers) {
      eventHandlers.push(handler.cb);
    }
  };

  off = (handler: Handler): void => {
    const eventHandlers = this.handlers[handler.kind];

    if (eventHandlers) {
      without(handler, (eventHandlers as unknown) as Handler[]);
    }
  };
}
