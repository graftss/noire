import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import * as selectors from '../../../state/selectors';
import * as actions from '../../../state/actions';
import { getNewController } from '../../../input/controller';
import { ControllerSelect } from './ControllerSelect';
import { ControllerEditor } from './ControllerEditor';
import { ControllerAdd } from './ControllerAdd';

interface PropsFromState {
  controllers: T.Controller[];
  selectedController: Maybe<T.Controller>;
}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  controllers: selectors.controllers(state),
  selectedController: selectors.selectedController(state),
});

interface PropsFromDispatch {
  addController: (kind: T.ControllerKind) => void;
  removeController: (id: string) => void;
  selectController: (id: string) => void;
  setControllerName: (id: string, name: string) => void;
}

interface ControllerEditorProps extends PropsFromState, PropsFromDispatch {}

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      addController: kind => actions.addController(getNewController(kind)),
      removeController: actions.removeController,
      selectController: actions.selectController,
      setControllerName: actions.setControllerName,
    },
    dispatch,
  );

const BaseControllerPane: React.SFC<ControllerEditorProps> = ({
  addController,
  controllers,
  removeController,
  selectedController,
  selectController,
  setControllerName,
}) => (
  <div>
    <ControllerAdd addController={addController} />
    <ControllerSelect
      controllers={controllers}
      selected={selectedController}
      selectController={selectController}
    />
    <ControllerEditor
      controller={selectedController}
      removeController={removeController}
      setControllerName={setControllerName}
    />
  </div>
);

export const ControllerPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseControllerPane);
