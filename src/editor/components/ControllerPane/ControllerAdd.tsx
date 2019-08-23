import * as React from 'react';
import * as T from '../../../types';
import { getControllerKinds } from '../../../input/controller';
import { SelectField } from '../controls/SelectField';

interface ControllerAddProps {
  addController: (kind: T.ControllerKind) => void;
}

interface ControllerKindOption {
  label: string;
  value: string;
}

const controllerKinds = getControllerKinds();

const toOption = (k: string): ControllerKindOption => ({ value: k, label: k });

export const ControllerAdd: React.SFC<ControllerAddProps> = ({
  addController,
}) => (
  <div>
    <SelectField
      data={controllerKinds}
      onConfirm={(kind: Maybe<T.ControllerKind>) => kind && addController(kind)}
      placeholder="add new controller"
      toOption={toOption}
    />
  </div>
);
