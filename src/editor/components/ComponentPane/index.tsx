import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import { components, selectedComponent } from '../../../state/selectors';
import {
  emitDisplayEvents,
  selectComponent,
  updateComponentState,
  updateComponentModel,
  updateComponentTexture,
} from '../../../state/actions';
import { updateSerializedKonvaModel } from '../../../display/model/konva';
import {
  defaultSerializedTexture,
  updateTexture,
} from '../../../display/texture';
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
  setDefaultTexture: (
    id: string,
    textureName: string,
    kind: T.TextureKind,
  ) => void;
  updateComponentState: (id: string, state: T.ComponentState) => void;
  updateComponentModel: (
    component: T.SerializedComponent,
    modelName: string,
    key: string,
    value: any,
  ) => void;
  updateComponentTexture: (
    component: T.SerializedComponent,
    textureName: string,
    key: string,
    value: any,
  ) => void;
}

const mapDispatchToProps = (dispatch): PropsFromDispatch => ({
  selectComponent: (id: string) => {
    dispatch(selectComponent(id));
    dispatch(emitDisplayEvents([{ kind: 'selectComponent', data: id }]));
  },

  setDefaultTexture: (id: string, textureName: string, kind: T.TextureKind) => {
    dispatch(
      updateComponentTexture(id, textureName, defaultSerializedTexture(kind)),
    );
    dispatch(
      emitDisplayEvents([
        {
          kind: 'requestDefaultComponentTexture',
          data: [id, textureName, kind],
        },
      ]),
    );
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
        updateSerializedKonvaModel(
          component.graphics.models[modelName],
          key,
          value,
        ),
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

  updateComponentTexture: (
    component: T.SerializedComponent,
    textureName: string,
    key: string,
    value: any,
  ) => {
    const texture = component.graphics.textures[textureName];

    dispatch(
      updateComponentTexture(
        component.id,
        textureName,
        updateTexture(texture, key, value),
      ),
    );

    dispatch(
      emitDisplayEvents([
        {
          kind: 'requestUpdateComponentTexture',
          data: [component.id, textureName, key, value],
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
  setDefaultTexture,
  updateComponentState,
  updateComponentModel,
  updateComponentTexture,
}) => (
  <div>
    <ComponentSelect
      components={components}
      selected={selectedComponent}
      selectComponent={selectComponent}
    />
    <ComponentEditor
      component={selectedComponent}
      setDefaultTexture={setDefaultTexture}
      updateComponentState={updateComponentState}
      updateComponentModel={updateComponentModel}
      updateComponentTexture={updateComponentTexture}
    />
  </div>
);

export const ComponentPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseComponentPane);
