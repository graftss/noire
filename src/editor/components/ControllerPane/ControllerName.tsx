import * as React from 'react';
import { TextInputWithDefault } from '../TextInputWithDefault';

interface ControllerNameProps {
  initialName: string;
  save: (o: string) => void;
}

export const ControllerName: React.SFC<ControllerNameProps> = ({
  initialName,
  save,
}) => {
  return (
    <div>
      name: <TextInputWithDefault defaultValue={initialName} save={save} />
    </div>
  );
};
