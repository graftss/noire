import * as React from 'react';
import * as T from '../../../types';
import { ControllerBindings } from './ControllerBindings';
import { ControllerName } from './ControllerName';

interface ControllerEditorProps {
  controller: Maybe<T.Controller>;
  removeController: (id: string) => void;
  setControllerName: (id: string, name: string) => void;
}

export const ControllerEditor: React.SFC<ControllerEditorProps> = ({
  controller,
  removeController,
  setControllerName,
}) =>
  controller ? (
    <div>
      <ControllerName
        initialName={controller.name}
        update={name => setControllerName(controller.id, name)}
      />
      <button onClick={() => removeController(controller.id)}>
        delete controller
      </button>
      <ControllerBindings controller={controller} />
    </div>
  ) : null;
