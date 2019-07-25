const { round, pow, sqrt } = Math;

const createCanvas = (): HTMLCanvasElement => document.createElement('canvas');

const copyImageData = (src: ImageData, dest: ImageData): void => {
  for (let i = 0; i < src.data.length; i++) {
    dest.data[i] = src.data[i];
  }
};

const dist = (x0, y0, x1, y1): number =>
  sqrt(pow(x1 - x0, 2) + pow(y1 - y0, 2));

export interface DistortFilterState {
  // the coordinates of the center of the distortion area
  xc: number;
  yc: number;

  // the radius of the full distortion area
  R: number;

  // the radius of the inner distortion area
  r: number;

  // the displacement of the inner distortion area from (xc, yc)
  xd: number;
  yd: number;
}

export const DistortFilter = () => ({
  xc,
  yc,
  R,
  r,
  xd,
  yd,
}: DistortFilterState) => (imageData): void => {
  const { data, height, width } = imageData;

  const buffer = createCanvas();
  buffer.width = width;
  buffer.height = height;
  const srcData = (buffer.getContext(
    '2d',
  ) as CanvasRenderingContext2D).getImageData(0, 0, width, height);

  copyImageData(imageData, srcData);

  const R2 = R * R;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const x0 = x - xc;
      const y0 = y - yc;
      const d0 = round(dist(0, 0, x0, y0));
      const dl = round(dist(xd, yd, x0, y0));
      const p = (y * width + x) << 2;

      if (d0 > R || dl < r) {
        continue;
      } else if (d0 === R) {
        srcData.data[p] = 255;
        continue;
      } else if (dl === r) {
        srcData.data[p + 1] = 255;
        continue;
      }

      // const pull = Math.min((R - d0) * (dl - r) / R / r, 2);
      const pull = ((R - d0) * (dl - r)) / R2;
      // console.log({ pull, d0, dl, R, r });
      const x1 = round(pull * (x0 - xd) + x);
      const y1 = round(pull * (y0 - yd) + y);

      const p1 = (y1 * width + x1) << 2;
      for (let i = 0; i < 4; i++) {
        srcData.data[p + i] = data[p1 + i];
      }
    }
  }

  copyImageData(srcData, imageData);
};
