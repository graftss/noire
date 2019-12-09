import * as React from 'react';
import { runOnEnterKeydown, defaultTo } from '../../../utils';
import { WithDefault } from './WithDefault';

interface TextFieldProps {
  defaultValue: string;
  initialValue?: string;
  update: (value: string) => void;
}

export const TextField: React.SFC<TextFieldProps> = ({
  defaultValue,
  initialValue,
  update,
}) => (
  <WithDefault
    initialValue={defaultTo(initialValue, defaultValue)}
    render={(value, setValue) => {
      const runUpdate = (): void => update(value);

      return (
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={runUpdate}
          onKeyDown={runOnEnterKeydown(runUpdate)}
          type="text"
        />
      );
    }}
  />
);
