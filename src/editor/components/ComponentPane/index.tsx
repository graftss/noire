import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  selectedComponent,
  allComponents,
  controllersById,
} from '../../../state/selectors';
import {
  addComponent,
  listenNextInput,
  updateComponentName,
  selectEditorOption,
} from '../../../state/actions';
import * as T from '../../../types';
import { ComponentEditor } from './ComponentEditor';
import { ComponentSelect } from './ComponentSelect';
import { AddComponent } from './AddComponent';

interface PropsFromState {
  components: T.SerializedComponent[];
  controllersById: Dict<T.Controller>;
  remapState: Maybe<T.RemapState>;
  selected: Maybe<T.SerializedComponent>;
}

interface PropsFromDispatch {
  addComponent: (k: T.ComponentKind) => void;
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
      addComponent,
      listenNextInput,
      selectComponent: id => selectEditorOption({ kind: 'component', id }),
      updateComponentName,
    },
    dispatch,
  );

const BaseComponentPane: React.SFC<ComponentPaneProps> = ({
  addComponent,
  components,
  controllersById,
  listenNextInput,
  remapState,
  selectComponent,
  selected,
  updateComponentName,
}) => (
  <div>
    <AddComponent
      addComponent={addComponent}
      componentKinds={['button', 'dpad', 'stick']}
    />

    <ComponentSelect
      all={components}
      selected={selected}
      selectComponent={selectComponent}
    />
    <ComponentEditor
      controllersById={controllersById}
      listenNextInput={listenNextInput}
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
