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

  // if true, draws borders around outer and inner distortion areas
  debug?: boolean;
}

export const DistortFilter = ({
  xc,
  yc,
  R,
  r,
  xd,
  yd,
  debug,
}: DistortFilterState) => (imageData: ImageData): void => {
  const { data, height, width } = imageData;

  const buffer = createCanvas();
  buffer.width = width;
  buffer.height = height;
  const srcData = (buffer.getContext(
    '2d',
  ) as CanvasRenderingContext2D).getImageData(0, 0, width, height);

  copyImageData(imageData, srcData);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const x0 = x - xc;
      const y0 = y - yc;
      const d0 = round(dist(0, 0, x0, y0));
      const dl = round(dist(xd, yd, x0, y0));
      const p = (y * width + x) << 2;

      if (d0 > R) {
        continue;
      } else if (debug && Math.abs(d0 - R) === 0) {
        srcData.data[p] = 255;
        srcData.data[p + 1] = 0;
        srcData.data[p + 2] = 0;
        continue;
      } else if (debug && dl === r) {
        srcData.data[p] = 0;
        srcData.data[p + 1] = 255;
        srcData.data[p + 1] = 0;
        continue;
      }

      let x1, y1;
      if (dl < r) {
        x1 = x - xd;
        y1 = y - yd;
      } else {
        const innerX0 = xd + ((x0 - xd) * r) / dl;
        const innerY0 = yd + ((y0 - yd) * r) / dl;
        const baseD0 = round(dist(0, 0, innerX0, innerY0));
        // const pull = (baseD0 - R) / (scaledD0 - R);
        const pull = (d0 - R) / (baseD0 - R);

        // if (Math.abs(d0 - R) <= 1) console.log({ d0, baseD0, pull });
        // if (Math.abs(dl - r) <= 1) console.log({ d0, baseD0, pull });

        x1 = x - round(xd * pull);
        y1 = y - round(yd * pull);
      }

      const p1 = (y1 * width + x1) << 2;
      for (let i = 0; i < 4; i++) {
        srcData.data[p + i] = data[p1 + i];
      }
    }
  }

  copyImageData(srcData, imageData);
};
