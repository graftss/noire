import Konva from 'konva';

import ComponentManager, { ComponentData } from './ComponentManager';
import { without } from '../utils';

type F1<T> = (t: T) => void;
type F2<T, U> = (t: T, u: U) => void;

export type Handler =
  { kind: 'stageClick', cb: F2<Konva.Stage, any> } |
  { kind: 'componentClick', cb: F1<ComponentData> } |
  { kind: 'componentAdd', cb: F1<ComponentData> };

export type DisplayEvent =
  { kind: 'stageClick', data: [Konva.Stage, any] } |
  { kind: 'componentClick', data: [ComponentData] } |
  { kind: 'componentAdd', data: [ComponentData] };

export default class DisplayEventBus {
  private stageClickHandlers: F2<Konva.Stage, any>[] = [];
  private componentClickHandlers: F1<ComponentData>[] = [];
  private componentAddHandlers: F1<ComponentData>[] = [];

  constructor(
    private stage: Konva.Stage,
    private cm: ComponentManager,
  ) {
    stage.on('click', e => this.emit({ kind: 'stageClick', data: [stage, e] }));
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
    }
  }

  on(handler: Handler) {
    switch (handler.kind) {
      case 'stageClick': return this.stageClickHandlers.push(handler.cb);
      case 'componentClick': return this.componentClickHandlers.push(handler.cb);
      case 'componentAdd': return this.componentAddHandlers.push(handler.cb);
    }
  }

  off(handler: Handler) {
    switch (handler.kind) {
      case 'stageClick': return without(handler.cb, this.stageClickHandlers);
      case 'componentClick': return without(handler.cb, this.componentClickHandlers);
      case 'componentAdd': return without(handler.cb, this.componentAddHandlers);
    }
  }
}
