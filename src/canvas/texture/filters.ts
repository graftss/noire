const createCanvas = (): HTMLCanvasElement => document.createElement('canvas');

const copyImageData = (src: ImageData, dest: ImageData): void => {
  for (let i = 0; i < src.data.length; i++) {
    dest.data[i] = src.data[i];
  }
};

export const DistortFilter = () =>
  // inArea: (x: number, y: number) => boolean,
  // areaDims: (x: number, y: number) => Vec2,
  // scale: number,
  (imageData): void => {
    const { data, height, width } = imageData;

    const buffer = createCanvas();
    buffer.width = width;
    buffer.height = height;
    const srcData = (buffer.getContext(
      '2d',
    ) as CanvasRenderingContext2D).getImageData(0, 0, width, height);

    const translation = { x: 50, y: 100 };
    let h1 = 0;
    let h2 = -translation.x - translation.y * width;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const p0 = (h1 + x) << 2;
        const p1 = (h2 + x) << 2;

        for (let i = 0; i < 4; i++) {
          srcData.data[p0 + i] = data[p1 + i];
        }
      }

      h1 += width;
      h2 += width;
    }

    copyImageData(srcData, imageData);
  };
