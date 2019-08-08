import * as React from 'react';
import { blurOnEnterKeyDown, defaultTo, toPrecision } from '../../../utils';
import { WithDefault } from './WithDefault';

interface FloatFieldProps {
  defaultValue: number;
  initialValue: Maybe<number>;
  precision?: number;
  update: (value: number) => void;
}

const parseNumber = (value: string, precision: number): number =>
  (precision === 1 ? parseInt : parseFloat)(value);

export const FloatField: React.SFC<FloatFieldProps> = ({
  defaultValue,
  initialValue,
  precision = 1,
  update,
}) => (
  <WithDefault
    initialValue={toPrecision(
      defaultTo(initialValue, defaultValue),
      precision,
    ).toString()}
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
