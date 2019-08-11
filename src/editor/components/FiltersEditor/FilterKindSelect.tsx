import * as React from 'react';
import * as T from '../../../types';
import { getInputFilterKinds } from '../../../display/filter';
import { SelectField } from '../controls/SelectField';

interface FilterKindSelectProps {
  initialValue?: Maybe<T.InputFilterKind>;
  setDefaultFilter: (k: T.InputFilterKind) => void;
}

interface FilterKindOption {
  label: string;
  value: string;
}

const toOption = (k: string): FilterKindOption => ({ value: k, label: k });

export const FilterKindSelect: React.SFC<FilterKindSelectProps> = ({
  initialValue,
  setDefaultFilter,
}) => (
  <div>
    <SelectField
      data={getInputFilterKinds()}
      initialValue={initialValue}
      onConfirm={(c: Maybe<T.InputFilterKind>) => c && setDefaultFilter(c)}
      placeholder="filter class"
      toOption={toOption}
    />
  </div>
);
