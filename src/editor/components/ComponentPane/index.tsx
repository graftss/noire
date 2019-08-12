import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import * as events from '../../../display/events';
import { components, selectedComponent } from '../../../state/selectors';
import {
  emitDisplayEvents,
  selectComponent,
  setComponentState,
  setComponentModel,
  setComponentTexture,
} from '../../../state/actions';
import {
  updateSerializedKonvaModel,
  defaultSerializedKonvaModel,
} from '../../../display/model/konva';
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
  setDefaultModel: (id: string, modelName: string, k: T.KonvaModelKind) => void;
  setDefaultTexture: (
    id: string,
    textureName: string,
    k: T.TextureKind,
  ) => void;
  setDefaultFilter: (
    id: string,
    modelName: string,
    filterIndex: number,
    kind: T.InputFilterKind,
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
  updateFilter: (
    c: T.SerializedComponent,
    modelName: string,
    filterIndex: number,
    key: string,
    value: any,
  ) => void;
}

const mapDispatchToProps = (dispatch): PropsFromDispatch => ({
  selectComponent: (id: string) => {
    dispatch(selectComponent(id));
    dispatch(emitDisplayEvents([events.selectComponent(id)]));
  },

  setDefaultModel: (id: string, modelName: string, kind: T.KonvaModelKind) => {
    const model = defaultSerializedKonvaModel(kind);

    dispatch(setComponentModel(id, modelName, model));
    dispatch(
      emitDisplayEvents([events.requestDefaultModel(id, modelName, kind)]),
    );
  },

  setDefaultTexture: (id: string, textureName: string, kind: T.TextureKind) => {
    const texture = defaultSerializedTexture(kind);

    dispatch(setComponentTexture(id, textureName, texture));
    dispatch(
      emitDisplayEvents([events.requestDefaultTexture(id, textureName, kind)]),
    );
  },

  setDefaultFilter: (
    id: string,
    modelName: string,
    filterIndex: number,
    kind: T.InputFilterKind,
  ) => {
    console.log('set default', { id, modelName, filterIndex, kind });
  },

  updateState: (component: T.SerializedComponent, key: string, value: any) => {
    const { id, state } = component;
    const newState = { ...state, [key]: value };

    dispatch(setComponentState(id, newState));
    dispatch(emitDisplayEvents([events.setComponentState(id, newState)]));
  },

  updateModel: (
    component: T.SerializedComponent,
    modelName: string,
    key: string,
    value: any,
  ) => {
    const model = component.graphics.models[modelName];
    const newModel = updateSerializedKonvaModel(model, key, value);
    const event = events.requestModelUpdate(
      component.id,
      modelName,
      key,
      value,
    );

    dispatch(setComponentModel(component.id, modelName, newModel));
    dispatch(emitDisplayEvents([event]));
  },

  updateTexture: (
    component: T.SerializedComponent,
    textureName: string,
    key: string,
    value: any,
  ) => {
    const {
      id,
      graphics: { textures },
    } = component;
    const newTexture = updateTexture(textures[textureName], key, value);
    const event = events.requestTextureUpdate(id, textureName, key, value);

    dispatch(setComponentTexture(component.id, textureName, newTexture));
    dispatch(emitDisplayEvents([event]));
  },

  updateFilter: (
    component: T.SerializedComponent,
    modelName: string,
    filterIndex: number,
    key: string,
    value: any,
  ) => {
    console.log('update', { component, modelName, filterIndex, key, value });
  },
});

interface ComponentPaneProps extends PropsFromState, PropsFromDispatch {}

const BaseComponentPane: React.SFC<ComponentPaneProps> = ({
  component,
  componentConfig,
  components,
  selectComponent,
  setDefaultModel,
  setDefaultTexture,
  setDefaultFilter,
  updateState,
  updateModel,
  updateTexture,
  updateFilter,
}) => (
  <div>
    <ComponentSelect
      components={components}
      selected={component}
      selectComponent={selectComponent}
    />
    {component === undefined || componentConfig === undefined ? null : (
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
          setDefaultModel={setDefaultModel}
          updateModel={updateModel}
        />
        <ComponentTextures
          component={component}
          setDefaultTexture={setDefaultTexture}
          textureList={componentConfig.textures}
          updateTexture={updateTexture}
        />
        <ComponentFilters
          component={component}
          setDefaultFilter={setDefaultFilter}
          updateFilter={updateFilter}
        />
      </div>
    )}
  </div>
);

export const ComponentPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseComponentPane);
