import * as React from 'react';
import * as T from '../../../types';
import { EditorField } from '../controls/EditorField';
import { getKonvaModelFields } from '../../../display/model/konva';
import { ModelKindSelect } from './ModelKindSelect';

interface ModelEditorProps {
  name: string;
  setDefaultModel: (name: string, k: T.KonvaModelKind) => void;
  model: Maybe<T.SerializedKonvaModel>;
  updateModel: (model: T.SerializedKonvaModel) => void;
}

export const ModelEditor: React.SFC<ModelEditorProps> = ({
  name,
  setDefaultModel,
  model,
  updateModel,
}) => (
  <div style={{ border: '1px solid red' }}>
    <div>{name}</div>
    <ModelKindSelect
      initialValue={model && model.kind}
      setDefaultModel={kind => setDefaultModel(name, kind)}
    />
    {model === undefined ? null : (
      <div>
        {getKonvaModelFields(model.kind).map(field => (
          <div key={field.key}>
            <EditorField
              field={field}
              initialValue={field.serialGetter(model)}
              update={value => updateModel(field.serialSetter(model, value))}
            />
          </div>
        ))}
      </div>
    )}
  </div>
);
