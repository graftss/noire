import * as React from 'react';
import * as T from '../../../types';
import { FilterEditor } from './FilterEditor';

interface FilterEditorProps<TS extends readonly string[]> {
  getRemapButtonValue: (filterKey: string, index: number) => T.RemapButtonValue;
  setDefaultFilter: (filterIndex: number, k: T.InputFilterKind) => void;
  filterList: T.SerializedInputFilter[];
  label: string;
  update: (filterIndex: number, key: string, value: any) => void;
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
      {filterList.map((filter, index) => (
        <FilterEditor
          key={index}
          getRemapButtonValue={key => getRemapButtonValue(key, index)}
          setDefaultFilter={kind => setDefaultFilter(index, kind)}
          filter={filter}
          update={(key, value) => update(index, key, value)}
        />
      ))}
    </div>
  );
}
