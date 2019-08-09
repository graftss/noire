import * as React from 'react';
import * as T from '../../../types';
import { ModelsEditor } from '../ModelsEditor';

interface ComponentModelsProps {
  component: T.SerializedComponent;
  modelList: readonly string[];
  setDefaultModel: (id: string, modelName: string, k: T.KonvaModelKind) => void;
  updateModel: (
    c: T.SerializedComponent,
    modelName: string,
    key: string,
    value: any,
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
      updateModel={(modelName, key, value) =>
        updateModel(component, modelName, key, value)
      }
    />
  </div>
);
