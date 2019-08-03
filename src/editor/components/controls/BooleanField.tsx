import * as React from 'react';
import { WithDefault } from './WithDefault';

interface BooleanFieldProps {
  defaultValue: boolean;
  update: (value: boolean) => void;
}

export const BooleanField: React.SFC<BooleanFieldProps> = ({
  defaultValue,
  update,
}) => (
  <WithDefault
    defaultValue={defaultValue}
    update={update}
    render={value => (
      <input type="checkbox" checked={value} onChange={() => update(!value)} />
    )}
  />
);
