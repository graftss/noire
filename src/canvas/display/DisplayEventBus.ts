import Konva from 'konva';

import * as T from '../../types';
import { Component } from '../component';
import { without } from '../../utils';

export type Handler =
  | { kind: 'stageClick'; cb: T.CB1<Konva.Stage> }
  | { kind: 'componentSelect'; cb: T.CB1<Component> }
  | { kind: 'componentAdd'; cb: T.CB1<Component> }
  | { kind: 'bindingAdd'; cb: T.CB2<Component, T.Binding> };

export type DisplayEvent =
  | { kind: 'stageClick'; data: [Konva.Stage] }
  | { kind: 'componentSelect'; data: [Component] }
  | { kind: 'componentAdd'; data: [Component] }
  | { kind: 'bindingAdd'; data: [Component, T.Binding] };

export class DisplayEventBus {
  private stageClickHandlers: T.CB1<Konva.Stage>[] = [];
  private componentClickHandlers: T.CB1<Component>[] = [];
  private componentAddHandlers: T.CB1<Component>[] = [];
  private bindingAddHandlers: T.CB2<Component, T.Binding>[] = [];

  emit(event: DisplayEvent): void {
    switch (event.kind) {
      case 'stageClick': {
        this.stageClickHandlers.forEach(cb => cb(...event.data));
        break;
      }

      case 'componentSelect': {
        this.componentClickHandlers.forEach(cb => cb(...event.data));
        break;
      }

      case 'componentAdd': {
        this.componentAddHandlers.forEach(cb => cb(...event.data));
        break;
      }

      case 'bindingAdd': {
        this.bindingAddHandlers.forEach(cb => cb(...event.data));
        break;
      }
    }
  }

  on(handler: Handler): void {
    switch (handler.kind) {
      case 'stageClick':
        this.stageClickHandlers.push(handler.cb);
        break;
      case 'componentSelect':
        this.componentClickHandlers.push(handler.cb);
        break;
      case 'componentAdd':
        this.componentAddHandlers.push(handler.cb);
        break;
      case 'bindingAdd':
        this.bindingAddHandlers.push(handler.cb);
        break;
    }
  }

  off(handler: Handler): void {
    switch (handler.kind) {
      case 'stageClick':
        without(handler.cb, this.stageClickHandlers);
        break;
      case 'componentSelect':
        without(handler.cb, this.componentClickHandlers);
        break;
      case 'componentAdd':
        without(handler.cb, this.componentAddHandlers);
        break;
      case 'bindingAdd':
        without(handler.cb, this.bindingAddHandlers);
        break;
    }
  }
}
