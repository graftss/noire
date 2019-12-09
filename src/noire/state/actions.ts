import * as T from '../types';
import * as events from '../display/events';
import { clipboard, tryClipboardParse } from '../utils';
import {
  defaultSerializedKonvaModel,
  stringToModel,
  modelToString,
} from '../display/model/konva';
import {
  defaultSerializedTexture,
  stringToTexture,
  textureToString,
} from '../display/texture';
import {
  cloneSerializedComponent,
  defaultSerializedComponent,
  deserializeComponent,
  getComponentInputFilter,
  getNewComponentFilterRef,
  stringToComponent,
  componentToString,
} from '../display/component';
import {
  defaultInputFilter,
  stringToFilter,
  filterToString,
} from '../display/filter';
import {
  cloneDisplay,
  displayToString,
  newDisplay,
  stringToDisplay,
} from '../display/serialize';

export type EditorAction =
  | { type: 'emitDisplayEvents'; data: T.DisplayEvent[] }
  | {
      type: 'setActiveDisplayDimensions';
      data: { width: number; height: number };
    }
  | { type: 'addComponent'; data: T.SerializedComponent }
  | { type: 'removeComponent'; data: string }
  | { type: 'selectComponent'; data: string }
  | { type: 'deselectComponent'; data: string }
  | { type: 'selectController'; data: Maybe<string> }
  | { type: 'addController'; data: T.Controller }
  | { type: 'removeController'; data: string }
  | { type: 'startFullControllerUpdate' }
  | { type: 'setControllerBinding'; data: T.ControllerBindingUpdate }
  | { type: 'setControllerName'; data: { id: string; name: string } }
  | {
      type: 'setComponentState';
      data: { id: string; state: T.ComponentState };
    }
  | {
      type: 'setComponentInputFilter';
      data: {
        id: string;
        ref: T.ComponentFilterRef;
        filter: T.InputFilter;
      };
    }
  | {
      type: 'removeComponentInputFilter';
      data: { id: string; ref: T.ComponentFilterRef };
    }
  | {
      type: 'setComponentModel';
      data: { id: string; modelName: string; model: T.SerializedKonvaModel };
    }
  | {
      type: 'setComponentTexture';
      data: { id: string; textureName: string; texture: T.SerializedTexture };
    }
  | { type: 'toggleKonvaTransformer' }
  | { type: 'listenNextInput'; data: T.RemapState }
  | { type: 'stopListening' }
  | { type: 'setTab'; data: T.TabKind }
  | { type: 'enterPresentationMode' }
  | { type: 'closePresentationSnackbar' }
  | { type: 'exitPresentationMode' }
  | { type: 'setActiveDisplayName'; data: string }
  | { type: 'saveDisplay'; data: T.SerializedDisplay }
  | { type: 'selectDisplay'; data: T.SerializedDisplay }
  | { type: 'removeDisplay'; data: string };

export type Dispatch = ((a: T.EditorAction) => void) | (() => void);

export type FuncCreator<T> = (t: T) => (d: Dispatch) => void;
export type FuncCreator0 = () => (d: Dispatch) => void;

export const emitDisplayEvents = (events: T.DisplayEvent[]): EditorAction => ({
  type: 'emitDisplayEvents',
  data: events,
});

export const selectController = (id?: string): EditorAction => ({
  type: 'selectController',
  data: id,
});

export const addController = (controller: T.Controller): EditorAction => ({
  type: 'addController',
  data: controller,
});

export const removeController = (id: string): EditorAction => ({
  type: 'removeController',
  data: id,
});

export const setControllerBinding = (
  update: T.ControllerBindingUpdate,
): EditorAction => ({
  type: 'setControllerBinding',
  data: update,
});

export const setControllerName = (id: string, name: string): EditorAction => ({
  type: 'setControllerName',
  data: { id, name },
});

export const setComponentState = (
  id: string,
  state: T.ComponentState,
): EditorAction => ({
  type: 'setComponentState',
  data: { id, state },
});

export const setComponentTexture = (
  id: string,
  textureName: string,
  texture: T.SerializedTexture,
): EditorAction => ({
  type: 'setComponentTexture',
  data: { id, textureName, texture },
});

export const toggleKonvaTransformer = (): EditorAction => ({
  type: 'toggleKonvaTransformer',
});

export const setComponentInputFilter = (
  id: string,
  ref: T.ComponentFilterRef,
  filter: T.InputFilter,
): EditorAction => ({
  type: 'setComponentInputFilter',
  data: { id, ref, filter },
});

export const removeComponentInputFilter = (
  id: string,
  ref: T.ComponentFilterRef,
): EditorAction => ({
  type: 'removeComponentInputFilter',
  data: { id, ref },
});

export const listenNextInput = (remapState: T.RemapState): EditorAction => ({
  type: 'listenNextInput',
  data: remapState,
});

export const stopListening = (): EditorAction => ({
  type: 'stopListening',
});

export const setTab = (kind: T.TabKind): EditorAction => ({
  type: 'setTab',
  data: kind,
});

export const setModel: FuncCreator<{
  id: string;
  modelName: string;
  model: T.SerializedKonvaModel;
}> = ({ id, modelName, model }) => dispatch => {
  const event = events.requestModelUpdate(id, modelName, model);

  dispatch({ type: 'setComponentModel', data: { id, modelName, model } });
  dispatch(emitDisplayEvents([event]));
};

export const setDefaultModel: FuncCreator<{
  id: string;
  modelName: string;
  kind: T.KonvaModelKind;
}> = ({ id, modelName, kind }) => dispatch => {
  const model = defaultSerializedKonvaModel(kind);
  setModel({ id, modelName, model })(dispatch);
};

export const importModel: FuncCreator<{
  id: string;
  modelName: string;
}> = ({ id, modelName }) => dispatch => {
  tryClipboardParse(
    stringToModel,
    model => setModel({ id, modelName, model })(dispatch),
    () => {},
  );
};

export const exportModel: FuncCreator<T.SerializedKonvaModel> = model => () => {
  clipboard.write(modelToString(model));
};

export const setTexture: FuncCreator<{
  id: string;
  textureName: string;
  texture: T.SerializedTexture;
}> = ({ id, textureName, texture }) => dispatch => {
  const event = events.requestTextureUpdate(id, textureName, texture);

  dispatch(setComponentTexture(id, textureName, texture));
  dispatch(emitDisplayEvents([event]));
};

export const setDefaultTexture: FuncCreator<{
  id: string;
  textureName: string;
  kind: T.TextureKind;
}> = ({ id, textureName, kind }) => dispatch => {
  const texture = defaultSerializedTexture(kind);
  setTexture({ id, textureName, texture })(dispatch);
};

export const importTexture: FuncCreator<{
  id: string;
  textureName: string;
}> = ({ id, textureName }) => dispatch => {
  tryClipboardParse(
    stringToTexture,
    texture => setTexture({ id, textureName, texture })(dispatch),
    () => {},
  );
};

export const exportTexture: FuncCreator<
  T.SerializedTexture
> = texture => () => {
  clipboard.write(textureToString(texture));
};

export const addFilter: FuncCreator<{
  component: T.SerializedComponent;
  modelName: string;
  kind: T.InputFilterKind;
}> = ({ component, modelName, kind }) => dispatch => {
  const ref = getNewComponentFilterRef(component, modelName);
  const filter = defaultInputFilter(kind);
  const event = events.requestFilterUpdate(component.id, ref, filter);

  dispatch(emitDisplayEvents([event]));
  dispatch(setComponentInputFilter(component.id, ref, filter));
};

export const removeFilter: FuncCreator<{
  id: string;
  ref: T.ComponentFilterRef;
}> = ({ id, ref }) => dispatch => {
  dispatch(emitDisplayEvents([events.requestRemoveFilter(id, ref)]));
  dispatch(removeComponentInputFilter(id, ref));
};

export const setFilter: FuncCreator<{
  id: string;
  ref: T.ComponentFilterRef;
  filter: T.InputFilter;
}> = ({ id, ref, filter }) => dispatch => {
  const event = events.requestFilterUpdate(id, ref, filter);

  dispatch(setComponentInputFilter(id, ref, filter));
  dispatch(emitDisplayEvents([event]));
};

export const setDefaultFilter: FuncCreator<{
  component: T.SerializedComponent;
  ref: T.ComponentFilterRef;
  kind: T.InputFilterKind;
}> = ({ component, ref, kind }) => dispatch => {
  const oldFilter = getComponentInputFilter(component, ref);
  const filter = defaultInputFilter(kind, oldFilter);

  setFilter({ id: component.id, ref, filter })(dispatch);
};

export const importFilter: FuncCreator<{
  id: string;
  ref: T.ComponentFilterRef;
}> = ({ id, ref }) => dispatch => {
  tryClipboardParse(
    stringToFilter,
    filter => setFilter({ id, ref, filter })(dispatch),
    () => {},
  );
};

export const importNewFilter: FuncCreator<{
  component: T.SerializedComponent;
  modelName: string;
}> = ({ component, modelName }) => dispatch => {
  importFilter({
    id: component.id,
    ref: getNewComponentFilterRef(component, modelName),
  })(dispatch);
};

export const exportFilter: FuncCreator<T.InputFilter> = filter => () => {
  clipboard.write(filterToString(filter));
};

export const setState: FuncCreator<{
  component: T.SerializedComponent;
  field: T.ComponentStateEditorField;
  value: any;
}> = ({ component, field, value }) => dispatch => {
  const { id, state } = component;
  const newState = field.setter(state, value);
  const event = events.setComponentState(id, newState);

  dispatch(setComponentState(id, newState));
  dispatch(emitDisplayEvents([event]));
};

export const addComponent: FuncCreator<
  T.SerializedComponent
> = component => dispatch => {
  const event = events.requestAddComponent(deserializeComponent(component));
  dispatch({ type: 'addComponent', data: component });
  dispatch(emitDisplayEvents([event]));
};

export const addDefaultComponent: FuncCreator<
  T.ComponentKind
> = kind => dispatch =>
  addComponent(defaultSerializedComponent(kind))(dispatch);

export const selectComponent: FuncCreator<string> = id => dispatch => {
  dispatch({ type: 'selectComponent', data: id });
  dispatch(emitDisplayEvents([events.requestSelectComponent(id)]));
};

export const importComponent: FuncCreator0 = () => dispatch => {
  tryClipboardParse(
    stringToComponent,
    component => addComponent(component)(dispatch),
    () => {},
  );
};

export const exportComponent: FuncCreator<
  T.SerializedComponent
> = component => () => {
  clipboard.write(componentToString(component));
};

export const deselectComponent: FuncCreator<string> = id => dispatch => {
  dispatch({ type: 'deselectComponent', data: id });
  dispatch(emitDisplayEvents([events.requestDeselectComponent(id)]));
};

export const cloneComponent: FuncCreator<
  T.SerializedComponent
> = component => dispatch => {
  const cloned = cloneSerializedComponent(component);
  addComponent(cloned)(dispatch);
  selectComponent(cloned.id)(dispatch);
};

export const removeComponent: FuncCreator<string> = id => dispatch => {
  const event = events.requestRemoveComponent(id);
  dispatch({ type: 'removeComponent', data: id });
  dispatch(emitDisplayEvents([event]));
};

export const selectDisplay: FuncCreator<{
  display: T.SerializedDisplay;
  saveToState?: boolean;
  loadIntoCanvas?: boolean;
}> = ({ display, saveToState = false, loadIntoCanvas = false }) => dispatch => {
  dispatch({ type: 'selectDisplay', data: display });
  if (saveToState) {
    dispatch({ type: 'saveDisplay', data: display });
  }
  if (loadIntoCanvas) {
    const event = events.requestLoadDisplay(display);
    dispatch(emitDisplayEvents([event]));
    // ?? should set active display here i think
  }
};

export const createNewDisplay: FuncCreator0 = () => dispatch =>
  selectDisplay({
    display: newDisplay(),
    saveToState: true,
    loadIntoCanvas: true,
  })(dispatch);

export const enterPresentationMode: FuncCreator0 = () => dispatch => {
  dispatch({ type: 'enterPresentationMode' });
  setTimeout(() => dispatch({ type: 'closePresentationSnackbar' }), 1000);
};

export const importDisplay: FuncCreator0 = () => dispatch => {
  tryClipboardParse(
    stringToDisplay,
    display =>
      selectDisplay({
        display: cloneDisplay(display),
        saveToState: true,
        loadIntoCanvas: true,
      })(dispatch),
    () => {},
  );
};

export const exportDisplay: FuncCreator<
  T.SerializedDisplay
> = display => () => {
  clipboard.write(displayToString(display));
};

export const removeDisplay: FuncCreator<
  T.SerializedDisplay
> = display => dispatch => {
  dispatch({ type: 'removeDisplay', data: display.id });
  dispatch(emitDisplayEvents([events.requestClearDisplay()]));
};

export const saveDisplay: FuncCreator<
  T.SerializedDisplay
> = display => dispatch => {
  selectDisplay({ display, saveToState: true })(dispatch);
};

export const saveDisplayAsNew: FuncCreator<
  T.SerializedDisplay
> = display => dispatch => {
  selectDisplay({
    display: cloneDisplay(display),
    saveToState: true,
  })(dispatch);
};

export const updateDisplayField: FuncCreator<{
  display: T.SerializedDisplay;
  field: T.DisplayField;
}> = ({ display, field }) => dispatch => {
  const event = events.requestUpdateDisplayField(display, field);

  saveDisplay(display)(dispatch);
  dispatch(emitDisplayEvents([event]));
};

export const selectExistingDisplay: FuncCreator<
  T.SerializedDisplay
> = display => dispatch => {
  selectDisplay({ display, loadIntoCanvas: true })(dispatch);
};

export const setActiveDisplayName = (name: string): EditorAction => ({
  type: 'setActiveDisplayName',
  data: name,
});

export const closePresentationSnackbar: FuncCreator0 = () => dispatch =>
  dispatch({ type: 'closePresentationSnackbar' });

export const exitPresentationMode = (): EditorAction => ({
  type: 'exitPresentationMode',
});
