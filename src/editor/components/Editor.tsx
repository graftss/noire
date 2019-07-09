import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as T from '../../types';
import { ComponentSelect } from './ComponentSelect';
import { ComponentBinding } from './ComponentBinding';
import { GamepadSelect } from './GamepadSelect';
import { selectComponent, selectGamepad } from '../../state/actions';
import { selectedComponentBinding } from '../../state/stateMaps';

interface PropsFromState {
  binding: T.Binding;
  selected: T.SerializedComponent;
  selectedGamepadIndex?: number;
  components: T.SerializedComponent[];
  controller: T.Controller;
}

interface PropsFromDispatch {
  selectComponent: (componentId: string) => void;
  selectGamepad: (index?: number) => void;
}

type EditorProps = PropsFromState & PropsFromDispatch;

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  binding: selectedComponentBinding(state.display),
  selected: state.display.selectedComponent,
  selectedGamepadIndex: state.input.gamepadIndex,
  components: state.display.components,
  controller: state.input.controller,
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators({ selectComponent, selectGamepad }, dispatch);

const BaseEditor: React.SFC<EditorProps> = ({
  binding,
  components,
  controller,
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
    <ComponentBinding binding={binding} controller={controller} />
  </div>
);

export const Editor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseEditor);
