import Konva from 'konva';

import * as T from '../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component = TypedComponent<any>;

export interface BaseComponentConfig {
  x?: number;
  y?: number;
  bindingId?: string;
  id?: string;
}

export abstract class TypedComponent<I> {
  protected config: BaseComponentConfig;
  group: Konva.Group;

  constructor(config: BaseComponentConfig) {
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
