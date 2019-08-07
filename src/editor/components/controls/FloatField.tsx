import * as React from 'react';
import { blurOnEnterKeyDown, toPrecision } from '../../../utils';
import { WithDefault } from './WithDefault';

interface FloatFieldProps {
  initialValue: number;
  precision?: number;
  update: (value: number) => void;
}

const parseNumber = (value: string, precision: number): number =>
  (precision === 1 ? parseInt : parseFloat)(value);

export const FloatField: React.SFC<FloatFieldProps> = ({
  initialValue,
  precision = 1,
  update,
}) => (
  <WithDefault
    initialValue={toPrecision(initialValue, precision).toString()}
    update={(value: string) => update(parseNumber(value, precision))}
    render={(value, setValue) => (
      <input
        value={value.toString()}
        onChange={e => setValue(e.target.value)}
        onBlur={() => update(parseNumber(value, precision))}
        onKeyDown={blurOnEnterKeyDown}
        type="text"
      />
    )}
  />
);
