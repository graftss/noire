const { atan2, round, cos, sin, abs, pow, sqrt } = Math;

const createCanvas = (): HTMLCanvasElement => document.createElement('canvas');

const copyImageData = (src: ImageData, dest: ImageData): void => {
  for (let i = 0; i < src.data.length; i++) {
    dest.data[i] = src.data[i];
  }
};

const dist = (x0, y0, x1, y1): number =>
  sqrt(pow(x1 - x0, 2) + pow(y1 - y0, 2));

const ease = (a, ta, b, tb, t): number => {
  if (t <= 0) return 0;
  if (t <= a) return ta - ((a - t) * ta) / a;
  if (t <= b) return ta + ((t - a) * (tb - ta)) / (b - a);
  if (t <= 1) return tb + ((t - b) * (1 - tb)) / (1 - b);
  return 1;
};

let xdd = 0;
let ydd = 0;

const solve = (x, y, a, R): number => {
  const B = 2 * x * cos(a) + 2 * y * sin(a);
  const C = x * x + y * y - R * R;
  return (-B + sqrt(B * B - 4 * C)) / 2;
};

export const DistortFilter = () =>
  // inArea: (x: number, y: number) => boolean,
  // areaDims: (x: number, y: number) => Vec2,
  // scale: number,
  (imageData): void => {
    const { data, height, width } = imageData;

    if (data[30] === 0) return;
    (window as any).stopUpdating = true;

    const buffer = createCanvas();
    buffer.width = width;
    buffer.height = height;
    const srcData = (buffer.getContext(
      '2d',
    ) as CanvasRenderingContext2D).getImageData(0, 0, width, height);

    copyImageData(imageData, srcData);

    let h = 0;

    const xc = 200;
    const yc = 200;
    const scale = 1;

    const R = 100;
    const r = round(R / 3);
    const xd = 45;
    const yd = 30;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const x0 = x - xc;
        const y0 = y - yc;
        const d0 = round(dist(0, 0, x0, y0));
        const dl = round(dist(xd, yd, x0, y0));
        const p = (h + x) << 2;

        if (d0 > R) {
          continue;
        } else if (d0 === R) {
          srcData.data[p] = 255;
          continue;
        } else if (dl === r) {
          srcData.data[p + 1] = 255;
          continue;
        } else if (
          (x0 > xd + r || x0 < xd - r) &&
          (y0 > yd + r || y0 < yd - r)
        ) {
          srcData.data[p + 0] = 0;
          srcData.data[p + 1] = 0;
          srcData.data[p + 2] = 255;
          continue;
        }

        for (let i = 0; i < 4; i++) {
          srcData.data[p + i] = 0;
        }
      }

      h += width;
    }

    copyImageData(srcData, imageData);
  };
