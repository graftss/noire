import Konva from 'konva';

import * as T from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component = TypedComponent<any>;

export abstract class TypedComponent<I> {
  group: Konva.Group;

  constructor(private baseConfig: T.BaseComponentConfig) {
    const { x, y } = baseConfig;

    this.group = new Konva.Group({ x, y });
  }

  getBindingId(): T.BindingId | undefined {
    return this.baseConfig.bindingId;
  }

  abstract update(input: I, dt: number): void;
}
