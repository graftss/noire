import * as React from 'react';
import * as T from '../../../types';
import { FilterEditor } from './FilterEditor';

interface FilterEditorProps<TS extends readonly string[]> {
  getRemapButtonValue: (filterKey: string, index: number) => T.RemapButtonValue;
  setDefaultFilter: (filterIndex: number, k: T.InputFilterKind) => void;
  filterList: T.InputFilter[];
  label: string;
  update: (filterIndex: number, filter: T.InputFilter) => void;
}

export function FiltersEditor<TS extends readonly string[]>({
  filterList,
  label,
  getRemapButtonValue,
  setDefaultFilter,
  update,
}: FilterEditorProps<TS>): JSX.Element {
  return (
    <div>
      <div>{label}</div>
      {filterList.map((filter, filterIndex) => (
        <FilterEditor
          key={filterIndex}
          getRemapButtonValue={key => getRemapButtonValue(key, filterIndex)}
          setDefaultFilter={kind => setDefaultFilter(filterIndex, kind)}
          filter={filter}
          update={filter => update(filterIndex, filter)}
        />
      ))}
    </div>
  );
}
