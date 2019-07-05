import Konva from 'konva';

import { BaseComponentConfig } from '../types';

export abstract class Component<T> {
  group: Konva.Group;

  constructor(
    private baseConfig: BaseComponentConfig,
  ) {
    const { x, y } = baseConfig;

    this.group = new Konva.Group({ x, y });
  }

  abstract update(input: T, dt: number): void;
}
