import * as React from 'react';
import * as T from '../../../types';
import { getInputFilterFields } from '../../../display/filter';
import { EditorField } from '../controls/EditorField';
import { FilterKeys } from './FilterKeys';
import { FilterKindSelect } from './FilterKindSelect';

interface FilterEditorProps {
  exportFilter: CB1<T.InputFilter>;
  filter: Maybe<T.InputFilter>;
  getRemapButtonValue: (field: T.InputFilterInputField) => T.RemapButtonValue;
  importFilter: CB0;
  name: string;
  remove: CB0;
  setDefaultFilter: (k: T.InputFilterKind) => void;
  update: (filter: T.InputFilter) => void;
}

export const FilterEditor: React.SFC<FilterEditorProps> = ({
  exportFilter,
  filter,
  getRemapButtonValue,
  importFilter,
  name,
  remove,
  setDefaultFilter,
  update,
}) =>
  filter === undefined ? null : (
    <div style={{ border: '1px solid blue', marginTop: '10px' }}>
      <div>
        Filter: <b>{name}</b>
        <button onClick={() => exportFilter(filter)}>export filter</button>
        <button onClick={importFilter}>import filter</button>
        <button onClick={remove}>remove filter</button>
      </div>
      <FilterKindSelect
        buttonText="set filter type"
        initialValue={filter.kind}
        handleSelection={setDefaultFilter}
      />
      {getInputFilterFields(filter.kind).map(field => (
        <div key={field.key}>
          <EditorField
            field={field}
            initialValue={field.getter(filter)}
            update={value => update(field.setter(filter, value))}
          />
        </div>
      ))}
      <FilterKeys filter={filter} getRemapButtonValue={getRemapButtonValue} />
    </div>
  );
