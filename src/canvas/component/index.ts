import Konva from 'konva';

import * as T from '../types';

export abstract class TypedComponent<I> {
  group: Konva.Group;

  constructor(private baseConfig: T.BaseComponentConfig) {
    const { x, y } = baseConfig;

    this.group = new Konva.Group({ x, y });
  }

  getBindingId(): T.BindingId | undefined {
    return this.baseConfig.bindingId;
  }

  getComponentId(): string {
    return this.baseConfig.componentId;
  }

  abstract update(input: I, dt: number): void;
}
