import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import { components, selectedComponent } from '../../../state/selectors';
import {
  emitDisplayEvents,
  selectEditorOption,
  updateComponentState,
  updateComponentShape,
} from '../../../state/actions';
import { updateSerializedShape } from '../../../display/editor';
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
  selectComponent: (id: string) => void;
  updateComponentState: (id: string, state: T.ComponentState) => void;
  updateComponentShape: (
    component: T.SerializedComponent,
    shapeName: string,
    key: string,
    value: any,
  ) => void;
}

const mapDispatchToProps = (dispatch): PropsFromDispatch => ({
  selectComponent: (id: string) => {
    dispatch(selectEditorOption({ kind: 'component', id }));
    dispatch(emitDisplayEvents([{ kind: 'selectComponent', data: id }]));
  },

  updateComponentState: (id: string, state: T.ComponentState) => {
    dispatch(updateComponentState(id, state));
    dispatch(
      emitDisplayEvents([{ kind: 'updateComponentState', data: [id, state] }]),
    );
  },

  updateComponentShape: (
    component: T.SerializedComponent,
    shapeName: string,
    key: string,
    value: any,
  ) => {
    dispatch(
      updateComponentShape(
        component.id,
        shapeName,
        updateSerializedShape(component.graphics.shapes[shapeName], key, value),
      ),
    );
  },
});

interface ComponentPaneProps extends PropsFromState, PropsFromDispatch {}

const BaseComponentPane: React.SFC<ComponentPaneProps> = ({
  components,
  selectComponent,
  selectedComponent,
  updateComponentState,
  updateComponentShape,
}) => (
  <div>
    <ComponentSelect
      components={components}
      selected={selectedComponent}
      selectComponent={selectComponent}
    />
    <ComponentEditor
      component={selectedComponent}
      updateComponentState={updateComponentState}
      updateComponentShape={updateComponentShape}
    />
  </div>
);

export const ComponentPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseComponentPane);
