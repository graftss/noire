import * as React from 'react';
import * as T from '../../../types';
import { getInputFilterFields } from '../../../display/filter';
import { EditorField } from '../controls/EditorField';
import { FilterKeys } from './FilterKeys';
import { FilterKindSelect } from './FilterKindSelect';

interface FilterEditorProps {
  filter: Maybe<T.InputFilter>;
  getRemapButtonValue: (filterKey: string) => T.RemapButtonValue;
  setDefaultFilter: (k: T.InputFilterKind) => void;
  remove: () => void;
  update: (filter: T.InputFilter) => void;
}

export const FilterEditor: React.SFC<FilterEditorProps> = ({
  getRemapButtonValue,
  setDefaultFilter,
  filter,
  remove,
  update,
}) =>
  filter === undefined ? null : (
    <div style={{ border: '1px solid green' }}>
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
      <button onClick={remove}>remove filter</button>
    </div>
  );
