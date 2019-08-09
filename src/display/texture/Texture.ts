import * as T from '../../types';
import { uuid } from '../../utils';

export abstract class Texture<K extends T.TextureKind = T.TextureKind> {
  readonly kind: K;
  state: T.TextureState<K>;
  hash: string;

  constructor(state: T.TextureState<K>) {
    this.update(state);
    this.hash = uuid();
  }

  update(update: Partial<T.TextureState<K>>): void {
    this.hash = uuid();
    this.state = { ...this.state, ...update };
  }

  protected shouldReapply(model: T.KonvaModel): boolean {
    return model.lastTextureHash !== this.hash;
  }

  abstract applyToModel(model: T.KonvaModel): void;

  apply = (model: T.KonvaModel): void => {
    if (this.shouldReapply(model)) {
      model.lastTextureHash = this.hash;
      this.applyToModel(model);
    }
  };
}
