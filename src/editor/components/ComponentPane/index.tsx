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
import { getComponentEditorConfig } from '../../../display/component/editor';
import { TransformerToggle } from '../controls/TransformerToggle';
import { ComponentSelect } from './ComponentSelect';
import { ComponentFilters } from './ComponentFilters';
import { ComponentTextures } from './ComponentTextures';
import { ComponentKeys } from './ComponentKeys';
import { ComponentState } from './ComponentState';
import { ComponentModels } from './ComponentModels';
import { ComponentTitle } from './ComponentTitle';

interface PropsFromState {
  component: Maybe<T.SerializedComponent>;
  componentConfig: Maybe<T.ComponentEditorConfig>;
  components: T.SerializedComponent[];
}

const mapStateToProps = (state: T.EditorState): PropsFromState => {
  const component = selectedComponent(state);
  const componentConfig = component
    ? getComponentEditorConfig(component.kind)
    : undefined;

  return {
    component,
    componentConfig,
    components: components(state),
  };
};

interface PropsFromDispatch {
  selectComponent: (id: string) => void;
  setDefaultTexture: (
    id: string,
    textureName: string,
    k: T.TextureKind,
  ) => void;
  updateState: (c: T.SerializedComponent, key: string, value: any) => void;
  updateModel: (
    c: T.SerializedComponent,
    modelName: string,
    key: string,
    value: any,
  ) => void;
  updateTexture: (
    c: T.SerializedComponent,
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
    const texture = defaultSerializedTexture(kind);
    const event: T.DisplayEvent = {
      kind: 'requestDefaultComponentTexture',
      data: [id, textureName, kind],
    };

    dispatch(updateComponentTexture(id, textureName, texture));
    dispatch(emitDisplayEvents([event]));
  },

  updateState: (component: T.SerializedComponent, key: string, value: any) => {
    const { id, state } = component;
    const newState = { ...state, [key]: value };
    const event: T.DisplayEvent = {
      kind: 'updateComponentState',
      data: [id, state],
    };

    dispatch(updateComponentState(id, newState));
    dispatch(emitDisplayEvents([event]));
  },

  updateModel: (
    component: T.SerializedComponent,
    modelName: string,
    key: string,
    value: any,
  ) => {
    const model = component.graphics.models[modelName];
    const newModel = updateSerializedKonvaModel(model, key, value);
    const event: T.DisplayEvent = {
      kind: 'requestUpdateComponentModel',
      data: [component.id, modelName, key, value],
    };

    dispatch(updateComponentModel(component.id, modelName, newModel));
    dispatch(emitDisplayEvents([event]));
  },

  updateTexture: (
    component: T.SerializedComponent,
    textureName: string,
    key: string,
    value: any,
  ) => {
    const texture = component.graphics.textures[textureName];
    const newTexture = updateTexture(texture, key, value);
    const event: T.DisplayEvent = {
      kind: 'requestUpdateComponentTexture',
      data: [component.id, textureName, key, value],
    };

    dispatch(updateComponentTexture(component.id, textureName, newTexture));
    dispatch(emitDisplayEvents([event]));
  },
});

interface ComponentPaneProps extends PropsFromState, PropsFromDispatch {}

const BaseComponentPane: React.SFC<ComponentPaneProps> = ({
  component,
  componentConfig,
  components,
  selectComponent,
  setDefaultTexture,
  updateState,
  updateModel,
  updateTexture,
}) =>
  component === undefined || componentConfig === undefined ? null : (
    <div>
      <ComponentSelect
        components={components}
        selected={component}
        selectComponent={selectComponent}
      />
      <div>
        <ComponentTitle label={componentConfig.title} />
        <TransformerToggle />
        <ComponentState
          component={component}
          stateConfig={componentConfig.state}
          update={(key, value) => updateState(component, key, value)}
        />
        <ComponentKeys component={component} keys={componentConfig.keys} />
        <ComponentModels
          component={component}
          modelList={componentConfig.models}
          updateModel={updateModel}
        />
        <ComponentTextures
          component={component}
          setDefaultTexture={setDefaultTexture}
          textureList={componentConfig.textures}
          updateTexture={updateTexture}
        />
        <ComponentFilters component={component} />
      </div>
    </div>
  );

export const ComponentPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseComponentPane);
