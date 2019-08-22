import * as React from 'react';
import * as T from '../../../types';
import { ModelsEditor } from '../ModelsEditor';

interface ComponentModelsProps {
  addFilter: (
    component: T.SerializedComponent,
    modelName: string,
    k: T.InputFilterKind,
  ) => void;
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
  addFilter,
  component,
  modelList,
  setDefaultModel,
  updateModel,
}) => (
  <div>
    <ModelsEditor
      addFilter={(modelName, k) => addFilter(component, modelName, k)}
      modelList={modelList}
      modelMap={component.graphics.models}
      setDefaultModel={(modelName, k) =>
        setDefaultModel(component.id, modelName, k)
      }
      updateModel={(name, model) => updateModel(component, name, model)}
    />
  </div>
);
