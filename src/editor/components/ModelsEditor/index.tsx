import * as React from 'react';
import * as T from '../../../types';
import { ModelEditor } from './ModelEditor';

interface ModelEditorProps<M extends readonly string[]> {
  addFilter: (modelName: string, kind: T.InputFilterKind) => void;
  modelList: M;
  modelMap: Record<M[number], T.SerializedKonvaModel>;
  setDefaultModel: (modelName: string, k: T.KonvaModelKind) => void;
  updateModel: (name: string, model: T.SerializedKonvaModel) => void;
}

export function ModelsEditor<TS extends readonly string[]>({
  addFilter,
  modelList,
  modelMap,
  setDefaultModel,
  updateModel,
}: ModelEditorProps<TS>): JSX.Element {
  return (
    <div>
      {modelList.map(name => (
        <ModelEditor
          addFilter={kind => addFilter(name, kind)}
          key={name}
          name={name}
          setDefaultModel={kind => setDefaultModel(name, kind)}
          model={modelMap[name]}
          updateModel={model => updateModel(name, model)}
        />
      ))}
    </div>
  );
}
