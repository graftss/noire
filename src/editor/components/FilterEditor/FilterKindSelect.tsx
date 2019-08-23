import * as React from 'react';
import * as T from '../../../types';
import { getInputFilterKinds } from '../../../display/filter';
import { SelectField } from '../controls/SelectField';

interface FilterKindSelectProps {
  buttonText: string;
  handleSelection: (k: T.InputFilterKind) => void;
  initialValue?: Maybe<T.InputFilterKind>;
}

interface FilterKindOption {
  label: string;
  value: string;
}

const toOption = (k: string): FilterKindOption => ({ value: k, label: k });

export const FilterKindSelect: React.SFC<FilterKindSelectProps> = ({
  buttonText,
  handleSelection,
  initialValue,
}) => (
  <div>
    <SelectField
      buttonText={buttonText}
      data={getInputFilterKinds()}
      initialValue={initialValue}
      onConfirm={(c: Maybe<T.InputFilterKind>) => c && handleSelection(c)}
      placeholder="filter class"
      toOption={toOption}
    />
  </div>
);
