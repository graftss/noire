import Konva from 'konva';

import * as T from '../types';
import * as M from '../gamepad/inputMaps';
import { Component } from '../component';
import { ComponentManager } from './ComponentManager';
import { without } from '../utils';

type F1<T> = (t: T) => void;
type F2<T, U> = (t: T, u: U) => void;

export type Handler =
  { kind: 'stageClick', cb: F1<Konva.Stage> } |
  { kind: 'componentClick', cb: F1<T.ComponentData> } |
  { kind: 'componentAdd', cb: F1<T.ComponentData> } |
  { kind: 'bindingAdd', cb: F2<Component<any>, T.BindingData> };

export type DisplayEvent =
  { kind: 'stageClick', data: [Konva.Stage] } |
  { kind: 'componentClick', data: [T.ComponentData] } |
  { kind: 'componentAdd', data: [T.ComponentData] } |
  { kind: 'bindingAdd', data: [Component<any>, T.BindingData] };

export class DisplayEventBus {
  private stageClickHandlers: F1<Konva.Stage>[] = [];
  private componentClickHandlers: F1<T.ComponentData>[] = [];
  private componentAddHandlers: F1<T.ComponentData>[] = [];
  private bindingAddHandlers: F2<Component<any>, T.BindingData>[] = [];

  constructor(
    private stage: Konva.Stage,
    private cm: ComponentManager,
  ) {
    stage.on('click', ({ target, currentTarget }) => {
      if (target === currentTarget) {
        this.emit({
          kind: 'stageClick',
          data: [stage],
        })
      }
    });
  }

  emit(event: DisplayEvent) {
    let hands
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

  on(handler: Handler) {
    switch (handler.kind) {
      case 'stageClick': return this.stageClickHandlers.push(handler.cb);
      case 'componentClick': return this.componentClickHandlers.push(handler.cb);
      case 'componentAdd': return this.componentAddHandlers.push(handler.cb);
      case 'bindingAdd': return this.bindingAddHandlers.push(handler.cb);
    }
  }

  off(handler: Handler) {
    switch (handler.kind) {
      case 'stageClick': return without(handler.cb, this.stageClickHandlers);
      case 'componentClick': return without(handler.cb, this.componentClickHandlers);
      case 'componentAdd': return without(handler.cb, this.componentAddHandlers);
      case 'bindingAdd': return without(handler.cb, this.bindingAddHandlers);
    }
  }
}
