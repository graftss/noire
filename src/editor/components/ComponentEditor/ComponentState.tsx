import * as React from 'react';
import * as T from '../../../types';
import { EditorField } from '../controls/EditorField';

interface ComponentStateProps {
  component: T.SerializedComponent;
  stateConfig: Maybe<T.ComponentStateEditorField[]>;
  update: (
    component: T.SerializedComponent,
    field: T.ComponentStateEditorField,
    value: any,
  ) => void;
}
export const ComponentState: React.SFC<ComponentStateProps> = ({
  component,
  stateConfig,
  update,
}) =>
  stateConfig === undefined ? null : (
    <div>
      {stateConfig.map(field => (
        <div key={field.key}>
          <EditorField
            initialValue={field.getter(component.state)}
            field={field}
            update={v => update(component, field, v)}
          />
        </div>
      ))}
    </div>
  );
