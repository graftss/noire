import * as React from 'react';
import { WithDefault } from './WithDefault';

interface BooleanFieldProps {
  initialValue: boolean;
  update: (value: boolean) => void;
}

export const BooleanField: React.SFC<BooleanFieldProps> = ({
  initialValue,
  update,
}) => (
  <WithDefault
    initialValue={initialValue}
    update={update}
    render={value => (
      <input type="checkbox" checked={value} onChange={() => update(!value)} />
    )}
  />
);
