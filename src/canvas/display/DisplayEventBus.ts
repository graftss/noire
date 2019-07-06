import Konva from 'konva';

import * as T from '../../types';
import { without } from '../../utils';

type F1<T> = (t: T) => void;
type F2<T, U> = (t: T, u: U) => void;

export type Handler =
  | { kind: 'stageClick'; cb: F1<Konva.Stage> }
  | { kind: 'componentSelect'; cb: F1<T.Component> }
  | { kind: 'componentAdd'; cb: F1<T.Component> }
  | { kind: 'bindingAdd'; cb: F2<T.Component, T.BindingData> };

export type DisplayEvent =
  | { kind: 'stageClick'; data: [Konva.Stage] }
  | { kind: 'componentSelect'; data: [T.Component] }
  | { kind: 'componentAdd'; data: [T.Component] }
  | { kind: 'bindingAdd'; data: [T.Component, T.BindingData] };

export class DisplayEventBus {
  private stageClickHandlers: F1<Konva.Stage>[] = [];
  private componentClickHandlers: F1<T.Component>[] = [];
  private componentAddHandlers: F1<T.Component>[] = [];
  private bindingAddHandlers: F2<T.Component, T.BindingData>[] = [];

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
