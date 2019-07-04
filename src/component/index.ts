import Konva from 'konva';

export default interface Component<T> {
  group: Konva.Group;
  update(input: T, dt: number): void;
}
