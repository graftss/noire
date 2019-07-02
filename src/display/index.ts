import Konva from 'konva';

export default abstract class Display<T> {
  stage: Konva.Stage;

  constructor(stage) {
    this.stage = stage;
  }

  abstract update(input: T, dt: number): void
}
