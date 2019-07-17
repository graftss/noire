import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import { selectedController, allController } from '../../../state/selectors';
import { selectEditorOption } from '../../../state/actions';
import { ControllerSelect } from './Select';

interface PropsFromState {
  controllers: T.Controller[];
  selectedController: Maybe<T.Controller>;
}

interface PropsFromDispatch {
  selectEditorOption: (o: T.EditorOption) => void;
}

interface ControllerEditorProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  controllers: allController(state.input),
  selectedController: selectedController(state.input),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
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
  selectedController,
  selectEditorOption,
}) => (
  <div>
    <ControllerSelect
      all={controllers}
      selected={selectedController}
      selectController={o => selectEditorOption(editorOption(o))}
    />
  </div>
);

export const ControllerEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseControllerEditor);
