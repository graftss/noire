import * as React from 'react';
import * as T from '../../../types';
import { EditorField } from '../controls/EditorField';
import { getKonvaModelFields } from '../../../display/model/konva';
import { ModelKindSelect } from './ModelKindSelect';
import { ModelAddFilter } from './ModelAddFilter';

interface ModelEditorProps {
  addFilter: (k: T.InputFilterKind) => void;
  name: string;
  setDefaultModel: (k: T.KonvaModelKind) => void;
  model: Maybe<T.SerializedKonvaModel>;
  updateModel: (model: T.SerializedKonvaModel) => void;
}

export const ModelEditor: React.SFC<ModelEditorProps> = ({
  addFilter,
  name,
  setDefaultModel,
  model,
  updateModel,
}) => (
  <div style={{ border: '1px solid red' }}>
    <div>{name}</div>
    <ModelKindSelect
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
              update={value => updateModel(field.setter(model, value))}
            />
          </div>
        ))}
        <ModelAddFilter addFilter={addFilter} />
      </div>
    )}
  </div>
);
