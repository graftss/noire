import * as React from 'react';
import * as T from '../../../types';
import { EditorField } from '../controls/EditorField';

interface ComponentStateProps {
  component: T.SerializedComponent;
  stateConfig: Maybe<T.StateEditorField[]>;
  update: (key: string, value: any) => void;
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
            defaultValue={component.state[field.key]}
            field={field}
            update={v => update(field.key, v)}
          />
        </div>
      ))}
    </div>
  );
