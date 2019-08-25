import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import * as events from '../../../display/events';
import * as actions from '../../../state/actions';
import { defaultSerializedKonvaModel } from '../../../display/model/konva';
import { defaultSerializedTexture } from '../../../display/texture';
import {
  cloneSerializedComponent,
  deserializeComponent,
  getComponentInputFilter,
  getNewComponentFilterRef,
} from '../../../display/component';
import { getComponentEditorConfig } from '../../../display/component/editor';
import { TransformerToggle } from '../controls/TransformerToggle';
import { defaultInputFilter } from '../../../display/filter';
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
  addFilter: (
    component: T.SerializedComponent,
    modelName: string,
    kind: T.InputFilterKind,
  ) => void;
  removeFilter: (id: string, ref: T.ComponentFilterRef) => void;
  setDefaultFilter: (
    component: T.SerializedComponent,
    ref: T.ComponentFilterRef,
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
    ref: T.ComponentFilterRef,
    filter: T.InputFilter,
  ) => void;
  cloneComponent: (component: T.SerializedComponent) => void;
  removeComponent: (id: string) => void;
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

  addFilter: (
    component: T.SerializedComponent,
    modelName: string,
    kind: T.InputFilterKind,
  ) => {
    const ref = getNewComponentFilterRef(component, modelName);
    const filter = defaultInputFilter(kind);
    const event = events.requestFilterUpdate(component.id, ref, filter);

    dispatch(actions.emitDisplayEvents([event]));
    dispatch(actions.setComponentInputFilter(component.id, ref, filter));
  },

  removeFilter: (id: string, ref: T.ComponentFilterRef) => {
    dispatch(actions.emitDisplayEvents([events.requestRemoveFilter(id, ref)]));
    dispatch(actions.removeComponentInputFilter(id, ref));
  },

  setDefaultFilter: (
    component: T.SerializedComponent,
    ref: T.ComponentFilterRef,
    kind: T.InputFilterKind,
  ) => {
    const oldFilter = getComponentInputFilter(component, ref);
    const filter = defaultInputFilter(kind, oldFilter);
    const event = events.requestFilterUpdate(component.id, ref, filter);

    dispatch(actions.emitDisplayEvents([event]));
    dispatch(actions.setComponentInputFilter(component.id, ref, filter));
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
    ref: T.ComponentFilterRef,
    filter: T.InputFilter,
  ) => {
    const event = events.requestFilterUpdate(component.id, ref, filter);

    dispatch(actions.setComponentInputFilter(component.id, ref, filter));
    dispatch(actions.emitDisplayEvents([event]));
  },

  cloneComponent: (component: T.SerializedComponent) => {
    const cloned = cloneSerializedComponent(component);
    const es = [
      events.requestAddComponent(deserializeComponent(cloned)),
      events.requestSelectComponent(cloned.id),
    ];

    dispatch(actions.addComponent(cloned));
    dispatch(actions.selectComponent(cloned.id));
    dispatch(actions.emitDisplayEvents(es));
  },

  removeComponent: (id: string) => {
    const event = events.requestRemoveComponent(id);

    dispatch(actions.removeComponent(id));
    dispatch(actions.emitDisplayEvents([event]));
  },
});

const BaseComponentEditor: React.SFC<ComponentEditorProps> = ({
  addFilter,
  cloneComponent,
  component,
  removeComponent,
  removeFilter,
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
      <div>
        <button onClick={() => removeComponent(component.id)}>
          remove component
        </button>
        <button onClick={() => cloneComponent(component)}>
          clone component
        </button>
      </div>
      <ComponentState
        component={component}
        stateConfig={config.state}
        update={updateState}
      />
      <ComponentKeys component={component} keys={config.keys} />
      <ComponentModels
        addFilter={addFilter}
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
        removeFilter={removeFilter}
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
