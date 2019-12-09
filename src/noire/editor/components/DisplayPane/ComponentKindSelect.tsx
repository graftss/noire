import * as React from 'react';
import * as T from '../../../types';
import { getComponentKinds } from '../../../display/component';
import { SelectField } from '../controls/SelectField';

interface ComponentKindSelectProps {
  buttonText: string;
  initialValue?: Maybe<T.ComponentKind>;
  handleSelection: (kind: T.ComponentKind) => void;
}

interface ComponentKindOption {
  label: string;
  value: string;
}

const componentKinds = getComponentKinds();

const toOption = (k: string): ComponentKindOption => ({ value: k, label: k });

export const ComponentKindSelect: React.SFC<ComponentKindSelectProps> = ({
  buttonText,
  handleSelection,
  initialValue,
}) => (
  <SelectField
    buttonText={buttonText}
    data={componentKinds}
    initialValue={initialValue}
    onConfirm={(c: Maybe<T.ComponentKind>) => c && handleSelection(c)}
    placeholder="component type"
    toOption={toOption}
  />
);
