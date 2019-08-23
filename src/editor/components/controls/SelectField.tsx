import * as React from 'react';
import { WithDefault } from './WithDefault';
import { EditorSelect } from './EditorSelect';

const indexSymbol = Symbol('index');
const nullIndex = -1;

interface BaseOption {
  value: string;
  label: string;
}

interface SelectFieldProps<T, O extends BaseOption> {
  autoConfirm?: boolean;
  buttonText: string;
  data: T[];
  initialValue?: Maybe<T>;
  onConfirm: (o: Maybe<T>) => void;
  placeholder: string;
  toOption: (t: T) => O;
}

type IndexedOption<O extends BaseOption> = O & {
  [indexSymbol]: number;
};

export function SelectField<T, O extends BaseOption>({
  autoConfirm = false,
  buttonText,
  data,
  initialValue,
  placeholder,
  toOption,
  onConfirm,
}: SelectFieldProps<T, O>): JSX.Element {
  const dataAtIndex = (index: number): Maybe<T> =>
    index === nullIndex ? undefined : data[index];

  const indexedToOption = (t: T, index: number): IndexedOption<O> => ({
    ...toOption(t),
    [indexSymbol]: index,
  });

  const initialDataIndex =
    initialValue === undefined ? -1 : data.indexOf(initialValue);
  const initialIndex = initialDataIndex === -1 ? nullIndex : initialDataIndex;

  return (
    <WithDefault
      initialValue={initialIndex}
      render={(index: number, setIndex: (index: number) => void) => (
        <div style={{ display: 'flex' }}>
          <div style={{ flexGrow: 100 }}>
            <EditorSelect
              data={data}
              selected={dataAtIndex(index)}
              onChange={option => {
                setIndex(option[indexSymbol]);
                if (autoConfirm) onConfirm(dataAtIndex(option[indexSymbol]));
              }}
              placeholder={placeholder}
              toOption={indexedToOption}
            />
          </div>
          {autoConfirm ? null : (
            <button onClick={() => onConfirm(dataAtIndex(index))}>
              {buttonText}
            </button>
          )}
        </div>
      )}
    />
  );
}
