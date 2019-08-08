import * as React from 'react';
import * as T from '../../../types';
import { getKonvaModelFields } from '../../../display/model/konva';
import { EditorField } from '../controls/EditorField';

interface ComponentModelsProps {
  component: T.SerializedComponent;
  modelList: readonly string[];
  updateModel: (
    id: T.SerializedComponent,
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
    <div>---</div>
    {modelList.map((modelName: string) => {
      const model: Maybe<T.SerializedKonvaModel> =
        component.graphics.models[modelName];
      if (!model) return null;

      const fields = getKonvaModelFields(model.className);

      return (
        <div key={modelName}>
          <div>
            <b>
              {modelName} ({model.className})
            </b>
          </div>
          <div>
            {fields.map(field => (
              <div key={field.label}>
                <EditorField
                  field={field}
                  initialValue={field.serialGetter(model)}
                  update={value =>
                    updateModel(component, modelName, field.key, value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      );
    })}
    <div>---</div>
  </div>
);
