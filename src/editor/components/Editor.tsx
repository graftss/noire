import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as T from '../../types';
import { ComponentSelect } from './ComponentSelect';
import { ControllerKeymap } from './ControllerKeymap';
import { ControllerSelect } from './ControllerSelect';
import { GamepadSelect } from './GamepadSelect';
import {
  listenNextInput,
  selectComponent,
  selectController,
  selectGamepad,
} from '../../state/actions';
import { selectedController } from '../../state/selectors';

interface PropsFromState {
  selected: T.SerializedComponent;
  selectedGamepadIndex?: number;
  components: T.SerializedComponent[];
  controllers: T.Controller[];
  selectedController: T.Controller | undefined;
  remapState: T.RemapState;
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
  selectedController: selectedController(state.input),
  remapState: state.input.remap,
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    { listenNextInput, selectComponent, selectGamepad, selectController },
    dispatch,
  );

const BaseEditor: React.SFC<EditorProps> = ({
  components,
  controllers,
  listenNextInput,
  remapState,
  selected,
  selectedGamepadIndex,
  selectComponent,
  selectController,
  selectedController,
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
      selectedController={selectedController}
      selectController={selectController}
    />
    {selectedController ? (
      <ControllerKeymap
        controller={selectedController}
        listenNextInput={listenNextInput}
        remapState={remapState}
      />
    ) : null}
  </div>
);

export const Editor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseEditor);
