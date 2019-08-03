import * as React from 'react';
import { blurOnEnterKeyDown } from '../../../utils';
import { WithDefault } from './WithDefault';

interface TextFieldProps {
  defaultValue: string;
  update: (value: string) => void;
}

export const TextField: React.SFC<TextFieldProps> = ({
  defaultValue,
  update,
}) => (
  <WithDefault
    defaultValue={defaultValue}
    update={update}
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
