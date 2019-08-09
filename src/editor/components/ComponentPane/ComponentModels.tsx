import * as React from 'react';
import * as T from '../../../types';
import { ModelsEditor } from '../ModelsEditor';

interface ComponentModelsProps {
  component: T.SerializedComponent;
  modelList: readonly string[];
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
  updateModel,
}) => (
  <div>
    <ModelsEditor
      modelList={modelList}
      modelMap={component.graphics.models}
      setDefaultModel={(name, k) => console.log('default', { name, k })}
      updateModel={(name, key, value) =>
        updateModel(component, name, key, value)
      }
    />
  </div>
);
