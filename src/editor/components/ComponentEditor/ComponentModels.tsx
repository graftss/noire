import * as React from 'react';
import * as T from '../../../types';
import { ModelsEditor } from '../ModelsEditor';
import { Section } from '../layout/Section'

interface ComponentModelsProps {
  component: T.SerializedComponent;
  modelList: readonly string[];
  setDefaultModel: CB1<{
    id: string;
    modelName: string;
    kind: T.KonvaModelKind;
  }>;
  addFilter: CB1<{
    component: T.SerializedComponent;
    modelName: string;
    kind: T.InputFilterKind;
  }>;
  updateModel: CB1<{
    component: T.SerializedComponent;
    modelName: string;
    model: T.SerializedKonvaModel;
  }>;
}

export const ComponentModels: React.SFC<ComponentModelsProps> = ({
  addFilter,
  component,
  modelList,
  setDefaultModel,
  updateModel,
}) => modelList.length === 0 ? null : (
  <Section>
    <ModelsEditor
      addFilter={(modelName, kind) => addFilter({ component, modelName, kind })}
      modelList={modelList}
      modelMap={component.graphics.models}
      setDefaultModel={(modelName, kind) =>
        setDefaultModel({ id: component.id, modelName, kind })
      }
      updateModel={(modelName, model) =>
        updateModel({ component, modelName, model })
      }
    />
  </Section>
);
