import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import { selectedController, allControllers } from '../../../state/selectors';
import {
  emitDisplayEvents,
  listenNextInput,
  selectEditorOption,
  updateControllerName,
} from '../../../state/actions';
import { ControllerSelect } from './ControllerSelect';
import { ControllerEditor } from './ControllerEditor';

interface PropsFromState {
  controllers: T.Controller[];
  remapState: Maybe<T.RemapState>;
  selectedController: Maybe<T.Controller>;
}

interface PropsFromDispatch {
  emitDisplayEvents: (e: T.DisplayEvent[]) => void;
  selectEditorOption: (o: T.EditorOption) => void;
  listenNextInput: (o: T.RemapState) => void;
  updateControllerName: (id: string, name: string) => void;
}

interface ControllerEditorProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  controllers: allControllers(state.input),
  remapState: state.input.remap,
  selectedController: selectedController(state.input),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      emitDisplayEvents,
      listenNextInput,
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
  emitDisplayEvents,
  listenNextInput,
  remapState,
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
      listenNextInput={(remap: T.RemapState) => {
        listenNextInput(remap);
        emitDisplayEvents([{ kind: 'listenNextInput', data: [remap] }]);
      }}
      remapState={remapState}
      updateControllerName={updateControllerName}
    />
  </div>
);

export const ControllerPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseControllerPane);
