import Konva from 'konva';
import * as T from '../../types';
import { Component } from '../component/Component';
import { without } from '../../utils';

export type Handler =
  | { kind: 'stageClick'; cb: CB1<Konva.Stage> }
  | { kind: 'componentSelect'; cb: CB1<Maybe<Component>> }
  | { kind: 'componentAdd'; cb: CB1<Component> }
  | { kind: 'bindingAdd'; cb: CB2<Component, T.Binding> }
  | { kind: 'requestDraw'; cb: CB0 };

export type DisplayEvent =
  | { kind: 'stageClick'; data: [Konva.Stage] }
  | { kind: 'componentSelect'; data: [Maybe<Component>] }
  | { kind: 'componentAdd'; data: [Component] }
  | { kind: 'bindingAdd'; data: [Component, T.Binding] }
  | { kind: 'requestDraw' };

export class DisplayEventBus {
  private stageClickHandlers: CB1<Konva.Stage>[] = [];
  private componentClickHandlers: CB1<Maybe<Component>>[] = [];
  private componentAddHandlers: CB1<Component>[] = [];
  private bindingAddHandlers: CB2<Component, T.Binding>[] = [];
  private requestDrawHandlers: CB0[] = [];

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

      case 'requestDraw': {
        this.requestDrawHandlers.forEach(cb => cb());
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
      case 'requestDraw':
        this.requestDrawHandlers.push(handler.cb);
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
      case 'requestDraw':
        without(handler.cb, this.requestDrawHandlers);
        break;
    }
  }
}
