import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import { selectedController, allControllers } from '../../../state/selectors';
import {
  listenNextInput,
  selectEditorOption,
  updateControllerName,
} from '../../../state/actions';
import { ControllerSelect } from './ControllerSelect';
import { ControllerEditor } from './ControllerEditor';

interface PropsFromState {
  controllers: T.Controller[];
  selectedController: Maybe<T.Controller>;
}

interface PropsFromDispatch {
  selectEditorOption: (o: T.EditorOption) => void;
  listenNextInput: (o: T.RemapState) => void;
  updateControllerName: (id: string, name: string) => void;
}

interface ControllerEditorProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  controllers: allControllers(state.input),
  selectedController: selectedController(state.input),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      listenNextInput,
      selectEditorOption,
      updateControllerName,
    },
    dispatch,
  );

const editorOption = (o): T.EditorOption => ({
  kind: 'controller',
  id: o ? o.value : undefined,
});

const BaseControllerPane: React.SFC<ControllerEditorProps> = ({
  controllers,
  listenNextInput,
  selectedController,
  selectEditorOption,
  updateControllerName,
}) => (
  <div>
    <ControllerSelect
      all={controllers}
      selected={selectedController}
      selectController={o => selectEditorOption(editorOption(o))}
    />
    <ControllerEditor
      controller={selectedController}
      listenNextInput={listenNextInput}
      updateControllerName={updateControllerName}
    />
  </div>
);

export const ControllerPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseControllerPane);
