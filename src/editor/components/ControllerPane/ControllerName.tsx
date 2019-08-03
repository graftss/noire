import * as React from 'react';
import { InputWithDefault } from '../controls/InputWithDefault';

interface ControllerNameProps {
  initialName: string;
  update: (o: string) => void;
}

export const ControllerName: React.SFC<ControllerNameProps> = ({
  initialName,
  update,
}) => {
  return (
    <div>
      name: <InputWithDefault defaultValue={initialName} update={update} />
    </div>
  );
};
