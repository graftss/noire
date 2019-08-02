import * as T from '../../types';
import { noop } from '../../utils';
import { copyImageData, createImageData, dist } from './utils';

const { round } = Math;

export interface ZoomFilterState {
  // the coordinates of the center of the zoom area
  xc: number;
  yc: number;

  // the radius of the affected (circular) area
  r: number;

  // the zoom factor; 1 is no zoom, 2 doubles the area's size,
  // 0.5 halves it.
  zoom: number;

  // if true, draws borders around original and final zoomed area
  debug?: boolean;
}

export const zoom: T.FilterFactory<ZoomFilterState> = ({
  xc,
  yc,
  r,
  zoom,
  debug,
}: ZoomFilterState) => (outputData: ImageData): void => {
  const { height, width } = outputData;

  const resultData = createImageData(width, height);
  copyImageData(outputData, resultData);

  if (outputData.data[30] === 0) return;
  // (window as any).stopUpdating = true;

  // final radius of zoomed area
  const zoomR = r * zoom;

  // radius of area outside of the zoomed area that's affect by the zoom
  const R = zoomR * 1.6;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = (y * width + x) << 2;

      // the coordinates (x, y) relative to the origin (xc, yc)
      // and their distance to that origin
      const x0 = x - xc;
      const y0 = y - yc;
      const d0 = round(dist(0, 0, x0, y0));

      if (d0 > zoomR) {
        continue;
      } else if (debug && d0 === R) {
        // draw red debug circle around full affected area
        resultData.data[p] = 255;
        resultData.data[p + 1] = 0;
        resultData.data[p + 2] = 0;
        continue;
      } else if (debug && d0 === zoomR) {
        // draw green debug circle around final zoomed area
        resultData.data[p] = 0;
        resultData.data[p + 1] = 255;
        resultData.data[p + 2] = 0;
        continue;
      } else if (debug && d0 === r) {
        // draw blue debug circle around initial zoomed area
        resultData.data[p] = 0;
        resultData.data[p + 1] = 0;
        resultData.data[p + 2] = 255;
        continue;
      }

      // (x1, y1) will be the mapped coordinate of (x, y)
      let x1, y1;
      if (d0 <= zoomR) {
        // scale the points inside the zoomed area by the zoom factor.
        // since (x0, y0) is relative to the center of the zoomed area,
        // we can just multiply those coordinates by the zoom factor
        // and add them back to the original point (x, y)
        x1 = round(x - x0 / zoom);
        y1 = round(y - y0 / zoom);
      } else {
        // here we're outside the zoomed area but inside the affected
        // area. we know that points outside the outer region have a
        // zoom factor of 1, and those inside the inner region have a
        // zoom factor of `zoom`. to keep the image continuous, in the
        // intermediate area we need to interpolate the zoom factors
        // of points between 1 and `zoom` as we move inward towards the
        // inner region. here we're using a linear transformation
        const scaledZoom = ((zoom - 1) / (zoomR - R)) * (d0 - zoomR) + zoom;

        // then we scale the original coordinates as before.
        // TODO: however this doesn't work for some reason. figure it
        // out at some point, probably.
        x1 = round(x - x0 / scaledZoom);
        y1 = round(y - y0 / scaledZoom);
      }

      const p1 = round(y1 * width + x1) << 2;
      for (let i = 0; i < 4; i++) {
        resultData.data[p + i] = outputData.data[p1 + i];
      }
    }
  }

  copyImageData(resultData, outputData);
};

export type ButtonZoomState = ZoomFilterState;

export interface ButtonZoomRawInput extends Dict<T.RawInput> {
  down: boolean;
}

export interface ButtonZoomData {
  state: ButtonZoomState;
  input: ButtonZoomRawInput;
}

export const buttonZoom: T.InputFilterFactory<'buttonZoom'> = ({
  state,
  input: { down },
}) => (down ? zoom(state) : noop);
