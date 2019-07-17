import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import { selectedController, allController } from '../../../state/selectors';
import { listenNextInput, selectEditorOption } from '../../../state/actions';
import { ControllerSelect } from './ControllerSelect';
import { ControllerBindings } from './ControllerBindings';

interface PropsFromState {
  controllers: T.Controller[];
  selectedController: Maybe<T.Controller>;
}

interface PropsFromDispatch {
  selectEditorOption: (o: T.EditorOption) => void;
  listenNextInput: (o: T.RemapState) => void;
}

interface ControllerEditorProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  controllers: allController(state.input),
  selectedController: selectedController(state.input),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      listenNextInput,
      selectEditorOption,
    },
    dispatch,
  );

const editorOption = (o): T.EditorOption => ({
  kind: 'controller',
  id: o ? o.value : undefined,
});

const BaseControllerEditor: React.SFC<ControllerEditorProps> = ({
  controllers,
  listenNextInput,
  selectedController,
  selectEditorOption,
}) => (
  <div>
    <ControllerSelect
      all={controllers}
      selected={selectedController}
      selectController={o => selectEditorOption(editorOption(o))}
    />
    {selectedController ? (
      <ControllerBindings
        controller={selectedController}
        listenNextInput={listenNextInput}
      />
    ) : null}
  </div>
);

export const ControllerEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseControllerEditor);
