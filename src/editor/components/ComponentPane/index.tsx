import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import { components, selectedComponent } from '../../../state/selectors';
import {
  emitDisplayEvents,
  selectEditorOption,
  updateComponentState,
  updateComponentModel,
} from '../../../state/actions';
import { updateSerializedModel } from '../../../display/editor';
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
  updateComponentModel: (
    component: T.SerializedComponent,
    modelName: string,
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

  updateComponentModel: (
    component: T.SerializedComponent,
    modelName: string,
    key: string,
    value: any,
  ) => {
    dispatch(
      updateComponentModel(
        component.id,
        modelName,
        updateSerializedModel(component.graphics.models[modelName], key, value),
      ),
    );

    dispatch(
      emitDisplayEvents([
        {
          kind: 'requestUpdateComponentModel',
          data: [component.id, modelName, key, value],
        },
      ]),
    );
  },
});

interface ComponentPaneProps extends PropsFromState, PropsFromDispatch {}

const BaseComponentPane: React.SFC<ComponentPaneProps> = ({
  components,
  selectComponent,
  selectedComponent,
  updateComponentState,
  updateComponentModel,
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
      updateComponentModel={updateComponentModel}
    />
  </div>
);

export const ComponentPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseComponentPane);
