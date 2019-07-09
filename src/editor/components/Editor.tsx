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
import { selectedComponentBinding } from '../../state/stateMaps';

interface PropsFromState {
  binding: T.Binding;
  selected: T.SerializedComponent;
  selectedGamepadIndex?: number;
  components: T.SerializedComponent[];
  controller: T.Controller;
}

interface PropsFromDispatch {
  listenNextInput: (remapState: T.RemapState) => void;
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
  bindActionCreators(
    { listenNextInput, selectComponent, selectGamepad },
    dispatch,
  );

const BaseEditor: React.SFC<EditorProps> = ({
  binding,
  components,
  controller,
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
    <ComponentBindings
      binding={binding}
      controller={controller}
      remap={binding =>
        listenNextInput({
          kind: 'component',
          componentId: selected.id,
          bindingKind: binding[2],
          inputKey: binding[3],
        })
      }
    />
  </div>
);

export const Editor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseEditor);
