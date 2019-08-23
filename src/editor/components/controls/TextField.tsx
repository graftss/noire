import * as React from 'react';
import { blurOnEnterKeyDown, defaultTo } from '../../../utils';
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
    render={(value, setValue) => (
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={() => update(value)}
        onKeyDown={blurOnEnterKeyDown}
        type="text"
      />
    )}
  />
);
