import * as React from 'react';

interface TextInputWithDefaultProps {
  defaultValue: string;
  save: (o: string) => void;
}

export const TextInputWithDefault: React.SFC<TextInputWithDefaultProps> = ({
  defaultValue,
  save,
}) => {
  const [name, setName] = React.useState(defaultValue);
  React.useEffect(() => setName(defaultValue), [defaultValue]);

  return (
    <input
      value={name}
      onChange={e => setName(e.target.value)}
      onBlur={e => save(e.target.value)}
      onKeyDown={e => {
        const target = e.target as HTMLInputElement;

        if (e.keyCode === 13) {
          save(target.value);
          target.blur();
        }
      }}
      type="text"
    />
  );
};
