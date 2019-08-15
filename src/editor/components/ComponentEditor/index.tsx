import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import * as events from '../../../display/events';
import * as actions from '../../../state/actions';
import { defaultSerializedKonvaModel } from '../../../display/model/konva';
import { defaultSerializedTexture } from '../../../display/texture';
import {
  getFilterInDict,
  updateComponentFilterState,
  deserializeComponentFilterDict,
  mapFilterInDict,
  defaultSerializedComponentFilter,
} from '../../../display/component';
import { getComponentEditorConfig } from '../../../display/component/editor';
import { TransformerToggle } from '../controls/TransformerToggle';
import { ComponentFilters } from './ComponentFilters';
import { ComponentTextures } from './ComponentTextures';
import { ComponentKeys } from './ComponentKeys';
import { ComponentState } from './ComponentState';
import { ComponentModels } from './ComponentModels';
import { ComponentTitle } from './ComponentTitle';

interface PropsFromDispatch {
  setDefaultModel: (id: string, modelName: string, k: T.KonvaModelKind) => void;
  setDefaultTexture: (
    id: string,
    textureName: string,
    k: T.TextureKind,
  ) => void;
  setDefaultFilter: (
    component: T.SerializedComponent,
    modelName: string,
    filterIndex: number,
    kind: T.InputFilterKind,
  ) => void;
  updateState: (
    c: T.SerializedComponent,
    field: T.ComponentStateEditorField,
    value: any,
  ) => void;
  updateModel: (
    c: T.SerializedComponent,
    modelName: string,
    model: T.SerializedKonvaModel,
  ) => void;
  updateTexture: (
    c: T.SerializedComponent,
    textureName: string,
    texture: T.SerializedTexture,
  ) => void;
  updateFilter: (
    c: T.SerializedComponent,
    modelName: string,
    filterIndex: number,
    key: string,
    value: any,
  ) => void;
}

interface ComponentEditorProps extends PropsFromDispatch {
  component: T.SerializedComponent;
}

const mapDispatchToProps = (dispatch): PropsFromDispatch => ({
  setDefaultModel: (id: string, modelName: string, kind: T.KonvaModelKind) => {
    const model = defaultSerializedKonvaModel(kind);
    const event = events.requestDefaultModel(id, modelName, kind);

    dispatch(actions.setComponentModel(id, modelName, model));
    dispatch(actions.emitDisplayEvents([event]));
  },

  setDefaultTexture: (id: string, textureName: string, kind: T.TextureKind) => {
    const texture = defaultSerializedTexture(kind);
    const event = events.requestDefaultTexture(id, textureName, kind);

    dispatch(actions.setComponentTexture(id, textureName, texture));
    dispatch(actions.emitDisplayEvents([event]));
  },

  setDefaultFilter: (
    component: T.SerializedComponent,
    modelName: string,
    filterIndex: number,
    kind: T.InputFilterKind,
  ) => {
    const newFilters = mapFilterInDict(
      component.filters,
      modelName,
      filterIndex,
      oldFilter => defaultSerializedComponentFilter(kind, oldFilter),
    );

    const event = events.setComponentFilters(
      component.id,
      deserializeComponentFilterDict(newFilters),
    );

    dispatch(actions.setComponentFilters(component.id, newFilters));
    dispatch(actions.emitDisplayEvents([event]));
  },

  updateState: (
    component: T.SerializedComponent,
    field: T.ComponentStateEditorField,
    value: any,
  ) => {
    const { id, state } = component;
    const newState = field.setter(state, value);
    const event = events.setComponentState(id, newState);

    dispatch(actions.setComponentState(id, newState));
    dispatch(actions.emitDisplayEvents([event]));
  },

  updateModel: (
    component: T.SerializedComponent,
    modelName: string,
    model: T.SerializedKonvaModel,
  ) => {
    const event = events.requestModelUpdate(component.id, modelName, model);

    dispatch(actions.setComponentModel(component.id, modelName, model));
    dispatch(actions.emitDisplayEvents([event]));
  },

  updateTexture: (
    component: T.SerializedComponent,
    textureName: string,
    texture: T.SerializedTexture,
  ) => {
    const { id } = component;
    const event = events.requestTextureUpdate(id, textureName, texture);

    dispatch(actions.setComponentTexture(id, textureName, texture));
    dispatch(actions.emitDisplayEvents([event]));
  },

  updateFilter: (
    component: T.SerializedComponent,
    modelName: string,
    filterIndex: number,
    key: string,
    value: any,
  ) => {
    const newFilters = mapFilterInDict(
      component.filters,
      modelName,
      filterIndex,
      oldFilter => updateComponentFilterState(oldFilter, key, value),
    );

    const newFilter = getFilterInDict(newFilters, modelName, filterIndex);
    if (!newFilter) return;

    const event = events.requestFilterUpdate(
      component.id,
      modelName,
      filterIndex,
      newFilter,
    );

    dispatch(actions.setComponentFilters(component.id, newFilters));
    dispatch(actions.emitDisplayEvents([event]));
  },
});

const BaseComponentEditor: React.SFC<ComponentEditorProps> = ({
  component,
  setDefaultModel,
  setDefaultTexture,
  setDefaultFilter,
  updateState,
  updateModel,
  updateTexture,
  updateFilter,
}) => {
  const config = getComponentEditorConfig(component.kind);

  return (
    <div>
      <ComponentTitle label={config.title} />
      <TransformerToggle />
      <ComponentState
        component={component}
        stateConfig={config.state}
        update={(key, value) => updateState(component, key, value)}
      />
      <ComponentKeys component={component} keys={config.keys} />
      <ComponentModels
        component={component}
        modelList={config.models}
        setDefaultModel={setDefaultModel}
        updateModel={updateModel}
      />
      <ComponentTextures
        component={component}
        setDefaultTexture={setDefaultTexture}
        textureList={config.textures}
        update={updateTexture}
      />
      <ComponentFilters
        component={component}
        setDefaultFilter={setDefaultFilter}
        updateFilter={updateFilter}
      />
    </div>
  );
};

export const ComponentEditor = connect(
  undefined,
  mapDispatchToProps,
)(BaseComponentEditor);
