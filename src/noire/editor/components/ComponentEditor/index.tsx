import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import * as actions from '../../../state/actions';
import { getComponentEditorConfig } from '../../../display/component/editor';
import { TransformerToggle } from '../controls/TransformerToggle';
import { Section } from '../layout/Section';
import { ComponentFilters } from './ComponentFilters';
import { ComponentTextures } from './ComponentTextures';
import { ComponentKeys } from './ComponentKeys';
import { ComponentState } from './ComponentState';
import { ComponentModels } from './ComponentModels';
import { ComponentTitle } from './ComponentTitle';

interface PropsFromDispatch {
  setDefaultModel: CB1<{
    id: string;
    modelName: string;
    kind: T.KonvaModelKind;
  }>;
  setDefaultTexture: CB1<{
    id: string;
    textureName: string;
    kind: T.TextureKind;
  }>;
  addFilter: CB1<{
    component: T.SerializedComponent;
    modelName: string;
    kind: T.InputFilterKind;
  }>;
  removeFilter: CB1<{ id: string; ref: T.ComponentFilterRef }>;
  exportFilter: CB1<T.InputFilter>;
  importFilter: CB1<{ id: string; ref: T.ComponentFilterRef }>;
  importNewFilter: CB1<{ component: T.SerializedComponent; modelName: string }>;
  setDefaultFilter: CB1<{
    component: T.SerializedComponent;
    ref: T.ComponentFilterRef;
    kind: T.InputFilterKind;
  }>;
  setState: CB1<{
    component: T.SerializedComponent;
    field: T.ComponentStateEditorField;
    value: any;
  }>;
  setModel: CB1<{
    id: string;
    modelName: string;
    model: T.SerializedKonvaModel;
  }>;
  exportModel: CB1<T.SerializedKonvaModel>;
  importModel: CB1<{ id: string; modelName: string }>;
  setTexture: CB1<{
    id: string;
    textureName: string;
    texture: T.SerializedTexture;
  }>;
  exportTexture: CB1<T.SerializedTexture>;
  importTexture: CB1<{ id: string; textureName: string }>;
  setFilter: CB1<{
    id: string;
    ref: T.ComponentFilterRef;
    filter: T.InputFilter;
  }>;
  cloneComponent: CB1<T.SerializedComponent>;
  removeComponent: CB1<string>;
  exportComponent: CB1<T.SerializedComponent>;
}

interface ComponentEditorProps extends PropsFromDispatch {
  component: T.SerializedComponent;
}

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(actions, dispatch);

const BaseComponentEditor: React.SFC<ComponentEditorProps> = ({
  addFilter,
  cloneComponent,
  component,
  exportComponent,
  exportFilter,
  exportModel,
  exportTexture,
  importFilter,
  importModel,
  importNewFilter,
  importTexture,
  removeComponent,
  removeFilter,
  setDefaultModel,
  setDefaultTexture,
  setDefaultFilter,
  setState,
  setModel,
  setTexture,
  setFilter,
}) => {
  const config = getComponentEditorConfig(component.kind);

  return (
    <div>
      <Section>
        <ComponentTitle label={config.title} />
        <TransformerToggle />
        <div>
          <button onClick={() => removeComponent(component.id)}>
            remove component
          </button>
          <button onClick={() => cloneComponent(component)}>
            clone component
          </button>
          <button onClick={() => exportComponent(component)}>
            export component
          </button>
        </div>
        <ComponentState
          component={component}
          stateConfig={config.state}
          update={setState}
        />
      </Section>
      <ComponentKeys component={component} keys={config.keys} />
      <ComponentModels
        addFilter={addFilter}
        component={component}
        exportModel={exportModel}
        importModel={importModel}
        importNewFilter={importNewFilter}
        modelList={config.models}
        setDefaultModel={setDefaultModel}
        setModel={setModel}
      />
      <ComponentTextures
        component={component}
        exportTexture={exportTexture}
        importTexture={importTexture}
        setDefaultTexture={setDefaultTexture}
        textureList={config.textures}
        update={setTexture}
      />
      <ComponentFilters
        component={component}
        exportFilter={exportFilter}
        importFilter={importFilter}
        removeFilter={removeFilter}
        setDefaultFilter={setDefaultFilter}
        setFilter={setFilter}
      />
    </div>
  );
};

export const ComponentEditor = connect(
  undefined,
  mapDispatchToProps,
)(BaseComponentEditor);
