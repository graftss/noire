import * as React from 'react';
import { defaultTo } from '../../../utils';
import { WithDefault } from './WithDefault';

interface BooleanFieldProps {
  defaultValue: boolean;
  initialValue: Maybe<boolean>;
  update: (value: boolean) => void;
}

export const BooleanField: React.SFC<BooleanFieldProps> = ({
  defaultValue,
  initialValue,
  update,
}) => (
  <WithDefault
    initialValue={defaultTo(initialValue, defaultValue)}
    update={update}
    render={value => (
      <input type="checkbox" checked={value} onChange={() => update(!value)} />
    )}
  />
);
