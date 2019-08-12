import * as React from 'react';
import * as T from '../../../types';
import { getInputFilterKeyList } from '../../../display/filter';
import { RemapButton } from '../controls/RemapButton';

interface FilterKeysProps {
  filter: T.SerializedInputFilter;
  getRemapButtonValue: (filterKey: string) => T.RemapButtonValue;
}

export const FilterKeys: React.SFC<FilterKeysProps> = ({
  filter,
  getRemapButtonValue,
}) => (
  <div>
    {getInputFilterKeyList(filter).map(({ filterKey }) => (
      <div key={filterKey}>
        {filterKey}:
        <RemapButton value={getRemapButtonValue(filterKey)} />
      </div>
    ))}
  </div>
);
