import * as React from 'react';
import * as T from '../../../types';
import { getInputFilterInputFields } from '../../../display/filter';
import { RemapButton } from '../controls/RemapButton';

interface FilterKeysProps {
  filter: T.InputFilter;
  getRemapButtonValue: (field: T.InputFilterInputField) => T.RemapButtonValue;
}

export const FilterKeys: React.SFC<FilterKeysProps> = ({
  filter,
  getRemapButtonValue,
}) => (
  <div>
    {getInputFilterInputFields(filter.kind).map(field => (
      <div key={field.key}>
        {field.label}:
        <RemapButton value={getRemapButtonValue(field)} />
      </div>
    ))}
  </div>
);
