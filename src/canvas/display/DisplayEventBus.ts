import Konva from 'konva';

import * as T from '../types';
import { Component } from '../component';
import { without } from '../../utils';

type F1<T> = (t: T) => void;
type F2<T, U> = (t: T, u: U) => void;

export type Handler =
  | { kind: 'stageClick'; cb: F1<Konva.Stage> }
  | { kind: 'componentClick'; cb: F1<T.ComponentData> }
  | { kind: 'componentAdd'; cb: F1<T.ComponentData> }
  | { kind: 'bindingAdd'; cb: F2<Component, T.BindingData> };

export type DisplayEvent =
  | { kind: 'stageClick'; data: [Konva.Stage] }
  | { kind: 'componentClick'; data: [T.ComponentData] }
  | { kind: 'componentAdd'; data: [T.ComponentData] }
  | { kind: 'bindingAdd'; data: [Component, T.BindingData] };

export class DisplayEventBus {
  private stageClickHandlers: F1<Konva.Stage>[] = [];
  private componentClickHandlers: F1<T.ComponentData>[] = [];
  private componentAddHandlers: F1<T.ComponentData>[] = [];
  private bindingAddHandlers: F2<Component, T.BindingData>[] = [];

  constructor(private stage: Konva.Stage) {
    stage.on('click', ({ target, currentTarget }) => {
      if (target === currentTarget) {
        this.emit({
          kind: 'stageClick',
          data: [stage],
        });
      }
    });
  }

  emit(event: DisplayEvent): void {
    switch (event.kind) {
      case 'stageClick': {
        this.stageClickHandlers.forEach(cb => cb(...event.data));
        break;
      }

      case 'componentClick': {
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
      case 'componentClick':
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
      case 'componentClick':
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
