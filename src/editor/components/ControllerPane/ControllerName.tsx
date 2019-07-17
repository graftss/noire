import * as React from 'react';

interface ControllerNameProps {
  initialName: string;
  save: (o: string) => void;
}

export const ControllerName: React.SFC<ControllerNameProps> = ({
  initialName,
  save,
}) => {
  const [name, setName] = React.useState(initialName);

  React.useEffect(() => setName(initialName), [initialName]);

  return (
    <div>
      name:{' '}
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onBlur={e => save(e.target.value)}
        onKeyDown={(e: any) => {
          if (e.keyCode === 13) {
            save(e.target.value);
            e.target.blur();
          }
        }}
        type="text"
      />
    </div>
  );
};
