import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../types';
import { listenNextInput, selectEditorOption } from '../../state/actions';
import { selectedController, selectedComponentProp } from '../../state/selectors';
import { ComponentEditor } from './ComponentEditor';
import { ComponentSelect } from './ComponentSelect';
import { ControllerKeymap } from './ControllerKeymap';
import { ControllerSelect } from './ControllerSelect';
import { GamepadSelect } from './GamepadSelect';
import { componentConfigs } from '../../canvas/component';

interface PropsFromState {
  selected: T.SerializedComponent;
  selectedGamepadIndex?: number;
  components: T.SerializedComponent[];
  controllers: T.Controller[];
  selectedComponent: T.SerializedComponent;
  selectedComponentEditorConfig: T.ComponentEditorConfig;
  selectedController: T.Controller | undefined;
  remapState: T.RemapState;
}

interface PropsFromDispatch {
  listenNextInput: (remapState: T.RemapState) => void;
  selectEditorOption: (o: T.EditorOption) => void;
}

type EditorProps = PropsFromState & PropsFromDispatch;

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  selected: state.display.selectedComponent,
  selectedGamepadIndex: state.input.selectedGamepadIndex,
  components: state.display.components,
  controllers: state.input.controllers,
  selectedComponent: state.display.selectedComponent,
  selectedComponentEditorConfig: componentConfigs[selectedComponentProp(state.display, 'kind')],
  selectedController: selectedController(state.input),
  remapState: state.input.remap,
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators({ listenNextInput, selectEditorOption }, dispatch);

const BaseEditor: React.SFC<EditorProps> = ({
  components,
  controllers,
  listenNextInput,
  selected,
  selectedComponent,
  selectedComponentEditorConfig,
  selectedController,
  selectEditorOption,
  selectedGamepadIndex,
  remapState,
}) => (
  <div>
    <GamepadSelect
      selectedIndex={selectedGamepadIndex}
      selectEditorOption={selectEditorOption}
    />
    <ComponentSelect
      components={components}
      selected={selected}
      selectEditorOption={selectEditorOption}
    />
    <ControllerSelect
      controllers={controllers}
      selectedController={selectedController}
      selectEditorOption={selectEditorOption}
    />
    {selectedController ? (
      <ControllerKeymap
        controller={selectedController}
        listenNextInput={listenNextInput}
        remapState={remapState}
      />
    ) : null}
    {selectedComponent ?(
      <ComponentEditor
        component={selectedComponent}
        config={selectedComponentEditorConfig}
      />
    ) : null}
  </div>
);

export const Editor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseEditor);
