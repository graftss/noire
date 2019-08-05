import * as React from 'react';
import * as T from '../../../types';
import { getKonvaShapeConfig } from '../../../display/editor';
import { EditorField } from '../controls/EditorField';

interface ComponentShapesProps {
  component: T.SerializedComponent;
  shapeList: readonly string[];
  updateComponentShape: (
    id: T.SerializedComponent,
    shapeName: string,
    key: string,
    value: any,
  ) => void;
}

export const ComponentShapes: React.SFC<ComponentShapesProps> = ({
  component,
  shapeList,
  updateComponentShape,
}) => (
  <div>
    <div>---</div>
    {shapeList.map((shapeName: string) => {
      const shape: Maybe<T.SerializedKonvaShape> =
        component.graphics.shapes[shapeName];
      if (!shape) return null;

      const { label, fields } = getKonvaShapeConfig(shape.className);

      return (
        <div key={shapeName}>
          <div>
            <em>{label}</em>
          </div>
          <div>
            {fields.map(field => (
              <div key={field.label}>
                <EditorField
                  field={field}
                  defaultValue={field.serialGetter(shape) || field.defaultValue}
                  update={value =>
                    updateComponentShape(component, shapeName, field.key, value)
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
