import Konva from 'konva';
import * as T from '../../types';
import { Component } from '../component/Component';
import { without } from '../../utils';

export type Handler =
  | { kind: 'stageClick'; cb: CB1<Konva.Stage> }
  | { kind: 'editorSelectComponent'; cb: CB1<Maybe<string>> }
  | { kind: 'componentSelect'; cb: CB1<Maybe<Component>> }
  | { kind: 'componentAdd'; cb: CB1<Component> }
  | { kind: 'bindingAdd'; cb: CB2<Component, T.Binding> }
  | { kind: 'requestDraw'; cb: CB0 };

export type DisplayEvent =
  | { kind: 'stageClick'; data: [Konva.Stage] }
  | { kind: 'editorSelectComponent'; data: [Maybe<string>] }
  | { kind: 'componentSelect'; data: [Maybe<Component>] }
  | { kind: 'componentAdd'; data: [Component] }
  | { kind: 'bindingAdd'; data: [Component, T.Binding] }
  | { kind: 'requestDraw'; data?: undefined };

export class DisplayEventBus {
  private handlers: Record<Handler['kind'], Function[]> = {
    stageClick: [],
    editorSelectComponent: [],
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
