import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import { selectedController, allControllers } from '../../../state/selectors';
import {
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
      selectEditorOption,
      updateControllerName,
    },
    dispatch,
  );

const toEditorOption = (id: Maybe<string>): T.EditorOption => ({
  kind: 'controller',
  id,
});

const BaseControllerPane: React.SFC<ControllerEditorProps> = ({
  controllers,
  selectedController,
  selectEditorOption,
  updateControllerName,
}) => (
  <div>
    <ControllerSelect
      all={controllers}
      selected={selectedController}
      selectController={id => selectEditorOption(toEditorOption(id))}
    />
    <ControllerEditor
      controller={selectedController}
      updateControllerName={updateControllerName}
    />
  </div>
);

export const ControllerPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseControllerPane);
