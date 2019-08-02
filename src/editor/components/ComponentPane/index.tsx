import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import { components, selectedComponent } from '../../../state/selectors';
import {
  emitDisplayEvents,
  selectEditorOption,
  updateComponentState,
} from '../../../state/actions';
import { ComponentEditor } from './ComponentEditor';
import { ComponentSelect } from './ComponentSelect';

interface PropsFromState {
  components: T.SerializedComponent[];
  selectedComponent: Maybe<T.SerializedComponent>;
}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  components: components(state),
  selectedComponent: selectedComponent(state),
});

interface PropsFromDispatch {
  emitDisplayEvents: (events: T.DisplayEvent[]) => void;
  selectComponent: (id: string) => void;
  updateComponentState: (id: string, state: T.ComponentState) => void;
}

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      emitDisplayEvents,
      selectComponent: id => selectEditorOption({ kind: 'component', id }),
      updateComponentState,
    },
    dispatch,
  );

interface ComponentPaneProps extends PropsFromState, PropsFromDispatch {}

const BaseComponentPane: React.SFC<ComponentPaneProps> = ({
  components,
  emitDisplayEvents,
  selectComponent,
  selectedComponent,
  updateComponentState,
}) => (
  <div>
    <ComponentSelect
      components={components}
      selected={selectedComponent}
      selectComponent={(id: string) => {
        selectComponent(id);
        emitDisplayEvents([{ kind: 'selectComponent', data: id }]);
      }}
    />
    <ComponentEditor
      component={selectedComponent}
      updateComponentState={updateComponentState}
    />
  </div>
);

export const ComponentPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseComponentPane);
