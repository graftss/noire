import * as React from 'react';
import * as T from '../../../types';
import { clipboard } from '../../../utils';
import { modelToString } from '../../../display/model/konva';
import { ModelEditor } from './ModelEditor';

interface ModelEditorProps<M extends readonly string[]> {
  addFilter: (modelName: string, kind: T.InputFilterKind) => void;
  importModel: (modelName: string) => void;
  modelList: M;
  modelMap: Record<M[number], T.SerializedKonvaModel>;
  setDefaultModel: (modelName: string, k: T.KonvaModelKind) => void;
  setModel: (name: string, model: T.SerializedKonvaModel) => void;
}

const exportModel = (model: T.SerializedKonvaModel): Promise<void> =>
  clipboard.write(modelToString(model));

export function ModelsEditor<TS extends readonly string[]>({
  addFilter,
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
