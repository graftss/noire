import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as T from '../../types';
import { ComponentSelect } from './ComponentSelect';
import { ComponentBindings } from './ComponentBindings';
import { GamepadSelect } from './GamepadSelect';
import {
  listenNextInput,
  selectComponent,
  selectGamepad,
} from '../../state/actions';
import { selectedComponentProp } from '../../state/stateMaps';

interface PropsFromState {
  selected: T.SerializedComponent;
  selectedGamepadIndex?: number;
  components: T.SerializedComponent[];
  controllers: T.Controller[];
}

interface PropsFromDispatch {
  listenNextInput: (remapState: T.RemapState) => void;
  selectComponent: (componentId: string) => void;
  selectGamepad: (index?: number) => void;
}

type EditorProps = PropsFromState & PropsFromDispatch;

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  selected: state.display.selectedComponent,
  selectedGamepadIndex: state.input.gamepadIndex,
  components: state.display.components,
  controllers: state.input.controllers,
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    { listenNextInput, selectComponent, selectGamepad },
    dispatch,
  );

const BaseEditor: React.SFC<EditorProps> = ({
  components,
  controllers,
  listenNextInput,
  selected,
  selectedGamepadIndex,
  selectComponent,
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
  </div>
);

export const Editor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseEditor);
