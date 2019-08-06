import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import { selectedController, controllers } from '../../../state/selectors';
import { selectController, updateControllerName } from '../../../state/actions';
import { ControllerSelect } from './ControllerSelect';
import { ControllerEditor } from './ControllerEditor';

interface PropsFromState {
  controllers: T.Controller[];
  selectedController: Maybe<T.Controller>;
}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  controllers: controllers(state),
  selectedController: selectedController(state),
});

interface PropsFromDispatch {
  selectController: (id: string) => void;
  updateControllerName: (id: string, name: string) => void;
}

interface ControllerEditorProps extends PropsFromState, PropsFromDispatch {}

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      selectController,
      updateControllerName,
    },
    dispatch,
  );

const BaseControllerPane: React.SFC<ControllerEditorProps> = ({
  controllers,
  selectedController,
  selectController,
  updateControllerName,
}) => (
  <div>
    <ControllerSelect
      controllers={controllers}
      selected={selectedController}
      selectController={selectController}
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
