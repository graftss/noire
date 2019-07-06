import Konva from 'konva';

import * as T from '../types';

export abstract class TypedComponent<I> {
  protected config: T.BaseComponentConfig;
  group: Konva.Group;

  constructor(config: T.BaseComponentConfig) {
    const { x, y } = config;

    this.config = config;
    this.group = new Konva.Group({ x, y });
  }

  getBindingId(): T.BindingId | undefined {
    return this.config.bindingId;
  }

  getId(): string {
    return this.config.id;
  }

  abstract update(input: I, dt: number): void;
}
