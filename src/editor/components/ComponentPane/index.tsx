import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import {
  allComponents,
  controllersById,
  selectedComponent,
} from '../../../state/selectors';
import {
  emitDisplayEvents,
  listenNextInput,
  selectEditorOption,
  updateComponentName,
} from '../../../state/actions';
import { ComponentEditor } from './ComponentEditor';
import { ComponentSelect } from './ComponentSelect';

interface PropsFromState {
  components: T.SerializedComponent[];
  controllersById: Dict<T.Controller>;
  remapState: Maybe<T.RemapState>;
  selected: Maybe<T.SerializedComponent>;
}

interface PropsFromDispatch {
  emitDisplayEvents: (events: T.DisplayEvent[]) => void;
  selectComponent: (id: string) => void;
  updateComponentName: (id: string, name: string) => void;
  listenNextInput: (s: T.RemapState) => void;
}

interface ComponentPaneProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state): PropsFromState => ({
  components: allComponents(state.display),
  controllersById: controllersById(state.input),
  remapState: state.input.remap,
  selected: selectedComponent(state.display),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      emitDisplayEvents,
      listenNextInput,
      selectComponent: id => selectEditorOption({ kind: 'component', id }),
      updateComponentName,
    },
    dispatch,
  );

const BaseComponentPane: React.SFC<ComponentPaneProps> = ({
  components,
  controllersById,
  emitDisplayEvents,
  listenNextInput,
  remapState,
  selectComponent,
  selected,
  updateComponentName,
}) => (
  <div>
    <ComponentSelect
      all={components}
      selected={selected}
      selectComponent={(id: string) => {
        selectComponent(id);
        emitDisplayEvents([{ kind: 'componentSelect', data: [id] }]);
      }}
    />
    <ComponentEditor
      controllersById={controllersById}
      listenNextInput={(remap: T.RemapState) => {
        listenNextInput(remap);
        emitDisplayEvents([{ kind: 'listenNextInput', data: [remap] }]);
      }}
      remapState={remapState}
      selected={selected}
      updateComponentName={updateComponentName}
    />
  </div>
);

export const ComponentPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseComponentPane);
