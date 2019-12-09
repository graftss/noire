import * as React from 'react';
import * as T from '../../../types';
import { getInputFilterInputFields } from '../../../display/filter';
import { RemapButtonList } from '../controls/RemapButtonList';

interface FilterKeysProps {
  filter: T.InputFilter;
  getRemapButtonValue: (field: T.InputFilterInputField) => T.RemapButtonValue;
}

export const FilterKeys: React.SFC<FilterKeysProps> = ({
  filter,
  getRemapButtonValue,
}) => (
  <div>
    <RemapButtonList
      data={getInputFilterInputFields(filter.kind).map(field => ({
        label: field.label,
        value: getRemapButtonValue(field),
      }))}
    />
  </div>
);
