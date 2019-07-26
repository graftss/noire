const { sqrt, pow } = Math;

export const createCanvas = (): HTMLCanvasElement =>
  document.createElement('canvas');

export const createImageData = (width: number, height: number): ImageData => {
  const canvas = createCanvas();
  canvas.height = height;
  canvas.width = width;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return ctx.getImageData(0, 0, width, height);
};

export const copyImageData = (src: ImageData, dest: ImageData): void => {
  for (let i = 0; i < src.data.length; i++) {
    dest.data[i] = src.data[i];
  }
};

export const dist = (x0: number, y0: number, x1: number, y1: number): number =>
  sqrt(pow(x1 - x0, 2) + pow(y1 - y0, 2));
