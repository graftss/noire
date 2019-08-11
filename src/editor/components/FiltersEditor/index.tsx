import * as React from 'react';
import * as T from '../../../types';
import { FilterEditor } from './FilterEditor';

interface FilterEditorProps<TS extends readonly string[]> {
  getRemapButtonValue: (filterKey: string, index: number) => T.RemapButtonValue;
  setDefaultFilter: (filterName: string, k: T.InputFilterKind) => void;
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
          getRemapButtonValue={filterKey =>
            getRemapButtonValue(filterKey, index)
          }
          setDefaultFilter={setDefaultFilter}
          filter={filter}
          update={(key: string, value) => update(index, key, value)}
        />
      ))}
    </div>
  );
}
