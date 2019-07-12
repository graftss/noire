import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as T from '../../types';
import { ComponentSelect } from './ComponentSelect';
import { ControllerBindings } from './ControllerBindings';
import { ControllerSelect } from './ControllerSelect';
import { GamepadSelect } from './GamepadSelect';
import {
  listenNextInput,
  selectComponent,
  selectController,
  selectGamepad,
} from '../../state/actions';

interface PropsFromState {
  selected: T.SerializedComponent;
  selectedGamepadIndex?: number;
  components: T.SerializedComponent[];
  controllers: T.Controller[];
  selectedControllerId: string | undefined;
}

interface PropsFromDispatch {
  listenNextInput: (remapState: T.RemapState) => void;
  selectComponent: (componentId: string) => void;
  selectGamepad: (index: number) => void;
  selectController: (id: string) => void;
}

type EditorProps = PropsFromState & PropsFromDispatch;

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  selected: state.display.selectedComponent,
  selectedGamepadIndex: state.input.gamepadIndex,
  components: state.display.components,
  controllers: state.input.controllers,
  selectedControllerId: state.input.selectedControllerId,
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    { listenNextInput, selectComponent, selectGamepad, selectController },
    dispatch,
  );

const BaseEditor: React.SFC<EditorProps> = ({
  components,
  controllers,
  selected,
  selectedGamepadIndex,
  selectComponent,
  selectController,
  selectedControllerId,
  selectGamepad,
}) => (
  <div>
    <GamepadSelect
      selectedIndex={selectedGamepadIndex}
      selectGamepad={selectGamepad}
    />
    <ComponentSelect
      components={components}
      selected={selected}
      select={selectComponent}
    />
    <ControllerSelect
      controllers={controllers}
      selectedControllerId={selectedControllerId}
      selectController={selectController}
    />
    <ControllerBindings />
  </div>
);

export const Editor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseEditor);
