import * as React from 'react';
import { blurOnEnterKeyDown } from '../../../utils';
import { WithDefault } from './WithDefault';

interface TextFieldProps {
  initialValue: string;
  update: (value: string) => void;
}

export const TextField: React.SFC<TextFieldProps> = ({
  initialValue,
  update,
}) => (
  <WithDefault
    initialValue={initialValue}
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
