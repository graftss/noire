import * as React from 'react';
import { TextField } from '../controls/TextField';

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
      name: <TextField defaultValue={initialName} update={update} />
    </div>
  );
};
