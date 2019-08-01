import * as React from 'react';
import * as T from '../../../types';
import { ControllerBindings } from './ControllerBindings';
import { ControllerName } from './ControllerName';

interface ControllerEditorProps {
  controller: Maybe<T.Controller>;
  updateControllerName: (id: string, name: string) => void;
}

export const ControllerEditor: React.SFC<ControllerEditorProps> = ({
  controller,
  updateControllerName,
}) =>
  controller ? (
    <div>
      <ControllerName
        initialName={controller.name}
        save={name => updateControllerName(controller.id, name)}
      />
      <ControllerBindings controller={controller} />
    </div>
  ) : null;
