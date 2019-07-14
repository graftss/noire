import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../types';
import { listenNextInput, selectEditorOption } from '../../state/actions';
import { selectedComponent, selectedController } from '../../state/selectors';
import { componentEditorConfigs } from '../../canvas/component';
import { ComponentEditor } from './ComponentEditor';
import { ComponentSelect } from './ComponentSelect';
import { ControllerKeymap } from './ControllerKeymap';
import { ControllerSelect } from './ControllerSelect';
import { GamepadSelect } from './GamepadSelect';

interface PropsFromState {
  components: T.SerializedComponent[];
  controllers: T.Controller[];
  inputMap?: Dict<T.ControllerKey>;
  remapState?: T.RemapState;
  selectedComponent?: T.SerializedComponent;
  selectedComponentEditorConfig?: T.ComponentEditorConfig;
  selectedController?: T.Controller;
  selected?: T.SerializedComponent;
  selectedGamepadIndex?: number;
}

interface PropsFromDispatch {
  listenNextInput: (remapState: T.RemapState) => void;
  selectEditorOption: (o: T.EditorOption) => void;
}

type EditorProps = PropsFromState & PropsFromDispatch;

// TODO: not sure I'm a fan of the monolothic editor anymore
const mapStateToProps = (state: T.EditorState): PropsFromState => {
  const sc = selectedComponent(state.display);
  const scProps = sc && {
    selectedComponent: sc,
    selectedComponentEditorConfig: componentEditorConfigs[sc.kind],
    inputMap: sc.state.inputMap,
  };

  return {
    selectedGamepadIndex: state.input.selectedGamepadIndex,
    components: state.display.components,
    controllers: state.input.controllers,
    selectedController: selectedController(state.input),
    remapState: state.input.remap,
    ...scProps,
  } as PropsFromState;
};

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators({ listenNextInput, selectEditorOption }, dispatch);

const BaseEditor: React.SFC<EditorProps> = ({
  components,
  controllers,
  listenNextInput,
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
      selected={selectedComponent}
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
        remapState={remapState as T.RemapState}
      />
    ) : null}
    {selectedComponent ? (
      <ComponentEditor
        config={selectedComponentEditorConfig as T.ComponentEditorConfig}
      />
    ) : null}
  </div>
);

export const Editor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseEditor);
