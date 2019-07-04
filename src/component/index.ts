import Konva from 'konva';

export interface BaseComponentConfig {
  x: number;
  y: number;
  bindingId?: string;
}

export default abstract class Component<T> {
  group: Konva.Group;

  constructor(
    private baseConfig: BaseComponentConfig,
  ) {
    const { x, y } = baseConfig;

    this.group = new Konva.Group({ x, y });
  }

  abstract update(input: T, dt: number): void;
}
