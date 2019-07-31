import * as T from '../../types';
import { normalizeAxis } from '../../utils';
import { copyImageData, createImageData, dist } from './utils';

const { round } = Math;

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

export const distort: T.Filter<DistortFilterState> = ({
  xc,
  yc,
  R,
  r,
  xd,
  yd,
  debug,
}: DistortFilterState) => (outputData: ImageData): void => {
  const { height, width } = outputData;

  const resultData = createImageData(width, height);
  copyImageData(outputData, resultData);

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
        resultData.data[p] = 255;
        resultData.data[p + 1] = 0;
        resultData.data[p + 2] = 0;
        continue;
      } else if (debug && dl === r) {
        resultData.data[p] = 0;
        resultData.data[p + 1] = 255;
        resultData.data[p + 2] = 0;
        continue;
      }

      let x1, y1;
      if (dl < r) {
        x1 = x - xd;
        y1 = y - yd;
      } else {
        // compute the point (x2, y2) between (x0, y0) and (xd, yd)
        // lying on the small region anchored at (xd, yd)
        const x2 = xd + ((x0 - xd) * r) / dl;
        const y2 = yd + ((y0 - yd) * r) / dl;

        // compute the distance D from the anchor of the big region
        // (0, 0) to (x2, y2)
        const D = round(dist(0, 0, x2, y2));

        // compute the "pull" factor, which determines how far the mapped
        // value of (x0, y0) is pulled towards (xd, yd). the pull is
        // scaled below so that all points in the inner region effectively
        // have a pull of 1, while points ouside the outer region have
        // an effective pull of 0 (since they don't move).
        //
        // this reduces the problem of maintaining image continuity under
        // the distortion to choosing a suitable map of points between the
        // inner and outer boundaries that's 0 on the outer boundary
        // and 1 on the inner boundary.

        const pull = Math.pow((d0 - R) / (D - R), 1);
        x1 = x - round(xd * pull);
        y1 = y - round(yd * pull);
      }

      const p1 = (y1 * width + x1) << 2;
      for (let i = 0; i < 4; i++) {
        resultData.data[p + i] = outputData.data[p1 + i];
      }
    }
  }

  copyImageData(resultData, outputData);
};

export interface StickDistortConfig {
  xc: number;
  yc: number;
  R: number;
  r: number;
  debug?: boolean;

  // a number between 0 and 1 that determines how close the inner region
  // can get to the outer region.
  leash: number;
}

export const stickDistortInputKinds: Dict<T.InputKind> = {
  xp: 'axis',
  xn: 'axis',
  yp: 'axis',
  yn: 'axis',
};

export interface StickDistortRawInput extends Dict<T.RawInput> {
  xp: number;
  xn: number;
  yp: number;
  yn: number;
}

export interface StickDistortData {
  config: StickDistortConfig;
  input: StickDistortRawInput;
}

export const stickDistort: T.TypedInputFilter<
  StickDistortConfig,
  StickDistortRawInput
> = ({ xc, yc, debug, R, r, leash }) => ({ xp, xn, yp, yn }) =>
  distort({
    xc,
    yc,
    debug,
    R,
    r,
    xd: Math.round(leash * (R - r) * normalizeAxis(xp, xn)),
    yd: Math.round(leash * (R - r) * normalizeAxis(yp, yn)),
  });

export type DPadDistortConfig = StickDistortConfig;

export const dPadDistortInputKinds: Dict<T.InputKind> = {
  u: 'button',
  l: 'button',
  d: 'button',
  r: 'button',
};

export type DPadDistortRawInput = T.RawInputProjection<T.DPadInput>;

export interface DPadDistortData {
  config: DPadDistortConfig;
  input: DPadDistortRawInput;
}

export const dPadDistort: T.TypedInputFilter<
  DPadDistortConfig,
  DPadDistortRawInput
> = ({ xc, yc, debug, R, r: _r, leash }) => ({ u, l, d, r }) =>
  distort({
    xc,
    yc,
    debug,
    R,
    r: _r,
    xd: Math.round(leash * (R - _r) * ((l ? -1 : 0) + (r ? 1 : 0))),
    yd: Math.round(leash * (R - _r) * ((u ? -1 : 0) + (d ? 1 : 0))),
  });
