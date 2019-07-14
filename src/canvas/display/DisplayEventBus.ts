import Konva from 'konva';
import * as T from '../../types';
import { Component } from '../component/Component';
import { without } from '../../utils';

export type Handler =
  | { kind: 'stageClick'; cb: CB1<Konva.Stage> }
  | { kind: 'componentSelect'; cb: CB1<Maybe<Component>> }
  | { kind: 'groupComponentSelect'; cb: CB1<Component & T.GroupContainer> }
  | { kind: 'componentAdd'; cb: CB1<Component> }
  | { kind: 'bindingAdd'; cb: CB2<Component, T.Binding> };

export type DisplayEvent =
  | { kind: 'stageClick'; data: [Konva.Stage] }
  | { kind: 'componentSelect'; data: [Maybe<Component>] }
  | { kind: 'groupComponentSelect'; data: [Component & T.GroupContainer] }
  | { kind: 'componentAdd'; data: [Component] }
  | { kind: 'bindingAdd'; data: [Component, T.Binding] };

export class DisplayEventBus {
  private stageClickHandlers: CB1<Konva.Stage>[] = [];
  private componentClickHandlers: CB1<Maybe<Component>>[] = [];
  private groupComponentClickHandlers: CB1<Component & T.GroupContainer>[] = [];
  private componentAddHandlers: CB1<Component>[] = [];
  private bindingAddHandlers: CB2<Component, T.Binding>[] = [];

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

      case 'groupComponentSelect': {
        this.groupComponentClickHandlers.forEach(cb => cb(...event.data));
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
      case 'groupComponentSelect':
        this.groupComponentClickHandlers.push(handler.cb);
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
      case 'groupComponentSelect':
        without(handler.cb, this.groupComponentClickHandlers);
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
