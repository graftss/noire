import * as React from 'react';
import * as T from '../../../types';
import { ModelsEditor } from '../ModelsEditor';
import { Section } from '../layout/Section';

interface ComponentModelsProps {
  component: T.SerializedComponent;
  exportModel: CB1<T.SerializedKonvaModel>;
  importModel: CB1<{ id: string; modelName: string }>;
  importNewFilter: CB1<{ component: T.SerializedComponent; modelName: string }>;
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
  setModel: CB1<{
    id: string;
    modelName: string;
    model: T.SerializedKonvaModel;
  }>;
}

export const ComponentModels: React.SFC<ComponentModelsProps> = ({
  addFilter,
  component,
  exportModel,
  importModel,
  importNewFilter,
  modelList,
  setDefaultModel,
  setModel,
}) =>
  modelList.length === 0 ? null : (
    <Section>
      <ModelsEditor
        addFilter={(modelName, kind) =>
          addFilter({ component, modelName, kind })
        }
        exportModel={exportModel}
        importNewFilter={modelName => importNewFilter({ component, modelName })}
        importModel={modelName => importModel({ id: component.id, modelName })}
        modelList={modelList}
        modelMap={component.graphics.models}
        setDefaultModel={(modelName, kind) =>
          setDefaultModel({ id: component.id, modelName, kind })
        }
        setModel={(modelName, model) =>
          setModel({ id: component.id, modelName, model })
        }
      />
    </Section>
  );
