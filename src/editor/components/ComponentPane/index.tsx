import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  selectedComponent,
  allComponents,
  controllersById,
} from '../../../state/selectors';
import {
  updateComponentName,
  selectEditorOption,
} from '../../../state/actions';
import * as T from '../../../types';
import { ComponentEditor } from './ComponentEditor';
import { ComponentSelect } from './ComponentSelect';

interface PropsFromState {
  components: T.SerializedComponent[];
  controllersById: Dict<T.Controller>;
  selected: Maybe<T.SerializedComponent>;
}

interface PropsFromDispatch {
  selectComponent: (id: string) => void;
  updateComponentName: (id: string, name: string) => void;
}

interface ComponentPaneProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state): PropsFromState => ({
  components: allComponents(state.display),
  controllersById: controllersById(state.input),
  selected: selectedComponent(state.display),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      selectComponent: id => selectEditorOption({ kind: 'component', id }),
      updateComponentName,
    },
    dispatch,
  );

const BaseComponentPane: React.SFC<ComponentPaneProps> = ({
  components,
  controllersById,
  selectComponent,
  selected,
  updateComponentName,
}) => (
  <div>
    <ComponentSelect
      all={components}
      selected={selected}
      selectComponent={selectComponent}
    />
    <ComponentEditor
      controllersById={controllersById}
      selected={selected}
      updateComponentName={updateComponentName}
    />
  </div>
);

export const ComponentPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseComponentPane);
