import * as T from '../../types';
import { Texture } from './Texture';

export type HiddenTextureState = undefined;

export const hiddenTextureFields: T.TextureField<'hidden'>[] = [];

export class HiddenTexture extends Texture<'hidden'> {
  readonly kind = 'hidden';

  constructor() {
    super(undefined);
  }

  applyToModel = (model: T.KonvaModel): void => {
    model.clearCache();
    model.fillPriority('color');
    model.fill('rgba(0,0,0,0)');
    model.cache(null);
  };
}
