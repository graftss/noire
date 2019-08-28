import * as React from 'react';
import * as T from '../../../types';
import { EditorField } from '../controls/EditorField';
import { getKonvaModelFields } from '../../../display/model/konva';
import { ModelKindSelect } from './ModelKindSelect';
import { ModelAddFilter } from './ModelAddFilter';

interface ModelEditorProps {
  addFilter: (k: T.InputFilterKind) => void;
  exportModel: (model: T.SerializedKonvaModel) => void;
  importNewFilter: () => void;
  importModel: CB1<string>;
  name: string;
  setDefaultModel: (k: T.KonvaModelKind) => void;
  model: Maybe<T.SerializedKonvaModel>;
  setModel: (model: T.SerializedKonvaModel) => void;
}

export const ModelEditor: React.SFC<ModelEditorProps> = ({
  addFilter,
  exportModel,
  importNewFilter,
  importModel,
  name,
  setDefaultModel,
  model,
  setModel,
}) => (
  <div>
    <div>
      Model: <b>{name}</b>
      <button onClick={() => importModel(name)}> import model </button>
      {model && (
        <button onClick={() => exportModel(model)}> export model </button>
      )}
    </div>
    <ModelKindSelect
      buttonText="set model type"
      initialValue={model && model.kind}
      setDefaultModel={setDefaultModel}
    />
    {model === undefined ? null : (
      <div>
        {getKonvaModelFields(model.kind).map(field => (
          <div key={field.key}>
            <EditorField
              field={field}
              initialValue={field.getter(model)}
              update={value => setModel(field.setter(model, value))}
            />
          </div>
        ))}
        <ModelAddFilter
          addFilter={addFilter}
          importNewFilter={importNewFilter}
        />
      </div>
    )}
  </div>
);
