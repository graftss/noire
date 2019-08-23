import * as React from 'react';
import * as T from '../../../types';
import { ControllerBindings } from './ControllerBindings';
import { ControllerName } from './ControllerName';

interface ControllerEditorProps {
  controller: Maybe<T.Controller>;
  removeController: (id: string) => void;
  updateControllerName: (id: string, name: string) => void;
}

export const ControllerEditor: React.SFC<ControllerEditorProps> = ({
  controller,
  removeController,
  updateControllerName,
}) =>
  controller ? (
    <div>
      <ControllerName
        initialName={controller.name}
        update={name => updateControllerName(controller.id, name)}
      />
      <button onClick={() => removeController(controller.id)}>
        delete controller
      </button>
      <ControllerBindings controller={controller} />
    </div>
  ) : null;
