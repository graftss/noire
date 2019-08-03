import * as React from 'react';
import { WithDefault } from './WithDefault';

interface TextFieldProps {
  defaultValue: string;
  type: 'number' | 'text';
  update: (value: string) => void;
}

const onKeyDown = (
  update: CB1<string>,
  e: React.KeyboardEvent<HTMLInputElement>,
): void => {
  if (e.keyCode === 13) (e.target as HTMLInputElement).blur();
};

export const TextField: React.SFC<TextFieldProps> = ({
  defaultValue,
  type,
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
        onKeyDown={e => onKeyDown(update, e)}
        type={type}
      />
    )}
  />
);
