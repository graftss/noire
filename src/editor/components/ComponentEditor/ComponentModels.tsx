import * as React from 'react';
import * as T from '../../../types';
import { ModelsEditor } from '../ModelsEditor';

interface ComponentModelsProps {
  component: T.SerializedComponent;
  modelList: readonly string[];
  setDefaultModel: (id: string, modelName: string, k: T.KonvaModelKind) => void;
  updateModel: (
    c: T.SerializedComponent,
    name: string,
    model: T.SerializedKonvaModel,
  ) => void;
}

export const ComponentModels: React.SFC<ComponentModelsProps> = ({
  component,
  modelList,
  setDefaultModel,
  updateModel,
}) => (
  <div>
    <ModelsEditor
      modelList={modelList}
      modelMap={component.graphics.models}
      setDefaultModel={(modelName, k) =>
        setDefaultModel(component.id, modelName, k)
      }
      updateModel={(name, model) => updateModel(component, name, model)}
    />
  </div>
);
