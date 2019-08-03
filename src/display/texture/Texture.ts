import Konva from 'konva';

export interface TypedSerializedTexture<K extends string, S extends object> {
  kind: K;
  state: S;
}

export abstract class TypedTexture<K extends string, S extends object> {
  constructor(protected kind: K, protected state: S) {}

  abstract apply: (shape: Konva.Shape) => void;

  serialize = (): TypedSerializedTexture<K, S> => ({
    kind: this.kind,
    state: this.state,
  });
}
