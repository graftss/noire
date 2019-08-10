import * as T from '../../types';
import { uuid } from '../../utils';

export abstract class Texture<K extends T.TextureKind = T.TextureKind> {
  readonly kind: K;
  state: T.TextureState<K>;
  hash: string;

  constructor(state: T.TextureState<K>) {
    this.update(state);
  }

  update(update: Partial<T.TextureState<K>>): void {
    this.hash = uuid();
    this.state = { ...this.state, ...update };
  }

  protected shouldReapply(model: T.KonvaModel): boolean {
    return model.lastTextureHash !== this.hash || !!model.dirty;
  }

  abstract applyToModel(model: T.KonvaModel): void;
  abstract cleanup(model: T.KonvaModel): void;

  apply = (model: T.KonvaModel): void => {
    if (this.shouldReapply(model)) {
      if (model.lastTexture) model.lastTexture.cleanup(model);
      model.lastTexture = this;
      model.lastTextureHash = this.hash;
      model.dirty = false;
      this.applyToModel(model);
    }
  };
}
