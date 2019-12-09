import * as React from 'react';
import * as T from '../../../types';
import { ModelEditor } from './ModelEditor';

interface ModelEditorProps<M extends readonly string[]> {
  addFilter: (modelName: string, kind: T.InputFilterKind) => void;
  exportModel: CB1<T.SerializedKonvaModel>;
  importNewFilter: CB1<string>;
  importModel: (modelName: string) => void;
  modelList: M;
  modelMap: Record<M[number], T.SerializedKonvaModel>;
  setDefaultModel: (modelName: string, k: T.KonvaModelKind) => void;
  setModel: (name: string, model: T.SerializedKonvaModel) => void;
}

export function ModelsEditor<TS extends readonly string[]>({
  addFilter,
  exportModel,
  importNewFilter,
  importModel,
  modelList,
  modelMap,
  setDefaultModel,
  setModel,
}: ModelEditorProps<TS>): JSX.Element {
  return (
    <div>
      {modelList.map(name => (
        <ModelEditor
          addFilter={kind => addFilter(name, kind)}
          key={name}
          exportModel={exportModel}
          importNewFilter={() => importNewFilter(name)}
          importModel={importModel}
          name={name}
          setDefaultModel={kind => setDefaultModel(name, kind)}
          model={modelMap[name]}
          setModel={model => setModel(name, model)}
        />
      ))}
    </div>
  );
}
