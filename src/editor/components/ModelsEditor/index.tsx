import * as React from 'react';
import * as T from '../../../types';
import { ModelEditor } from './ModelEditor';

interface ModelEditorProps<M extends readonly string[]> {
  modelList: M;
  modelMap: Record<M[number], T.SerializedKonvaModel>;
  setDefaultModel: (modelName: string, k: T.KonvaModelKind) => void;
  updateModel: (name: string, model: T.SerializedKonvaModel) => void;
}

export function ModelsEditor<TS extends readonly string[]>({
  modelList,
  modelMap,
  setDefaultModel,
  updateModel,
}: ModelEditorProps<TS>): JSX.Element {
  return (
    <div>
      {modelList.map(name => (
        <ModelEditor
          key={name}
          name={name}
          setDefaultModel={setDefaultModel}
          model={modelMap[name]}
          updateModel={model => updateModel(name, model)}
        />
      ))}
    </div>
  );
}
