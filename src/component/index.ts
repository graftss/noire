import Konva from 'konva';

import * as T from '../types';

export abstract class Component<I> {
  group: Konva.Group;

  constructor(
    private baseConfig: T.BaseComponentConfig,
  ) {
    const { x, y } = baseConfig;

    this.group = new Konva.Group({ x, y });
  }

  abstract update(input: I, dt: number): void;
}
