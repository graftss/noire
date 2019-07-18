import * as React from 'react';
import { TextInputWithDefault } from '../TextInputWithDefault';

interface ComponentNameProps {
  initialName: string;
  save: (o: string) => void;
}

export const ComponentName: React.SFC<ComponentNameProps> = ({
  initialName,
  save,
}) => {
  return (
    <div>
      name: <TextInputWithDefault defaultValue={initialName} save={save} />
    </div>
  );
};
