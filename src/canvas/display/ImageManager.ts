interface ImageEmitter {
  image: Maybe<HTMLImageElement>;
  handlers: CB1<HTMLImageElement>[];
  loaded: boolean;
}

export class ImageManager {
  emitters: Record<string, ImageEmitter> = {};

  private emitterRef(key: string): ImageEmitter {
    if (this.emitters[key]) return this.emitters[key];

    this.emitters[key] = {
      image: undefined,
      handlers: [],
      loaded: false,
    };

    return this.emitters[key];
  }

  load = (key: string, src: string): void => {
    const image = new Image();
    const emitter = this.emitterRef(key);

    if (emitter.image) return;

    emitter.image = image;
    image.src = src;
    image.onload = () => {
      emitter.loaded = true;
      emitter.handlers.forEach(f => f(image));
    };
  };

  onLoad = (key: string, cb: CB1<Maybe<HTMLImageElement>>): void => {
    const { image, loaded, handlers } = this.emitterRef(key);
    loaded ? cb(image) : handlers.push(cb);
  };
}
