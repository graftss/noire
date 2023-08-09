import * as T from '../types';
import { portOutdatedDisplay } from '../display/serialize';
import * as selectors from './selectors';
import { initialInputState } from './reducers/input';
import { initialLocalState } from './reducers/local';
import { initialSavedDisplaysState } from './reducers/savedDisplays';

export interface PersistentState {
  controllers: T.Controller[];
  savedDisplays: T.SavedDisplaysState;
  local: T.LocalState;
}

export const defaultPersistentState: PersistentState = {
  controllers: [],
  savedDisplays: initialSavedDisplaysState,
  local: initialLocalState,
};

const DEFAULT_DISPLAY = '{ "id": "6bc791c7-1931-44f2-8a6d-bd028fbd8a0a", "name": "katamari", "components": [{ "id": "a2155a94-ef86-4868-89be-a7bdf696fa94", "kind": "stick", "graphics": { "models": { "boundary": { "kind": "Circle", "attrs": { "x": 0, "y": 0, "radius": 30, "drawFromCenter": true } }, "stick": { "kind": "Circle", "attrs": { "x": 0, "y": 0, "radius": 9, "drawFromCenter": true } } }, "textures": { "boundary": { "state": { "fill": "rgba(0,0,0,0)", "stroke": "black", "strokeWidth": 3 }, "kind": "fill" }, "stick": { "state": { "fill": "black", "stroke": "red", "strokeWidth": 0 }, "kind": "fill" }, "stickDown": { "state": { "fill": "darkred", "stroke": "red", "strokeWidth": 0 }, "kind": "fill" }, "center": { "hash": "ad1b55d0-43d6-4819-ae06-80a5ecda1798", "state": {}, "kind": "hidden" } } }, "state": { "name": "left stick", "boundaryRadius": 20, "useDepthScaling": false, "inputMap": { "xp": { "controllerId": "ace4376b-5faa-486e-995b-e4f905ab7afd", "key": "lsXP" }, "xn": { "controllerId": "ace4376b-5faa-486e-995b-e4f905ab7afd", "key": "lsXN" }, "yp": { "controllerId": "ace4376b-5faa-486e-995b-e4f905ab7afd", "key": "lsYP" }, "yn": { "controllerId": "ace4376b-5faa-486e-995b-e4f905ab7afd", "key": "lsYN" }, "button": { "controllerId": "ace4376b-5faa-486e-995b-e4f905ab7afd", "key": "l3" } }, "position": { "x": 50, "y": 50 } }, "filters": {} }, { "id": "5dfb5a3a-86bc-46dd-b68d-53c682785fe4", "kind": "stick", "graphics": { "models": { "boundary": { "kind": "Circle", "attrs": { "x": 0, "y": 0, "radius": 30, "drawFromCenter": true } }, "stick": { "kind": "Circle", "attrs": { "x": 0, "y": 0, "radius": 9, "drawFromCenter": true } } }, "textures": { "boundary": { "state": { "fill": "rgba(0,0,0,0)", "stroke": "black", "strokeWidth": 3 }, "kind": "fill" }, "stick": { "state": { "fill": "black", "stroke": "red", "strokeWidth": 0 }, "kind": "fill" }, "stickDown": { "state": { "fill": "darkred", "stroke": "red", "strokeWidth": 0 }, "kind": "fill" }, "center": { "hash": "8a679943-ac9b-4f33-a3d6-5f78607a68c7", "state": {}, "kind": "hidden" } } }, "state": { "name": "right stick", "boundaryRadius": 18, "useDepthScaling": false, "inputMap": { "xp": { "controllerId": "ace4376b-5faa-486e-995b-e4f905ab7afd", "key": "rsXP" }, "xn": { "controllerId": "ace4376b-5faa-486e-995b-e4f905ab7afd", "key": "rsXN" }, "yp": { "controllerId": "ace4376b-5faa-486e-995b-e4f905ab7afd", "key": "rsYP" }, "yn": { "controllerId": "ace4376b-5faa-486e-995b-e4f905ab7afd", "key": "rsYN" }, "button": { "controllerId": "ace4376b-5faa-486e-995b-e4f905ab7afd", "key": "r3" } }, "position": { "x": 150, "y": 50 } }, "filters": {} }, { "id": "ebde2ae8-dff6-44e0-a966-34de533f27e2", "kind": "button", "graphics": { "models": { "model": { "kind": "Circle", "attrs": { "x": 0, "y": 0, "radius": 10, "drawFromCenter": true } } }, "textures": { "on": { "state": { "fill": "green", "stroke": "red", "strokeWidth": 0 }, "kind": "fill" }, "off": { "hash": "534f3acd-a84c-4f00-a058-8b89876d0cf3", "state": {}, "kind": "hidden" } } }, "state": { "name": "text advance (X)", "inputMap": { "button": { "controllerId": "3b0c5fc7-c9a9-41d8-ad57-dc1385d7d1c3", "key": "x" } }, "scale": { "x": 1, "y": 1 }, "position": { "x": 200, "y": 15 }, "rotation": 0 }, "filters": {} }, { "id": "0d8851c3-0c4f-44fc-9141-a6ccd967b0bf", "kind": "button", "graphics": { "models": { "model": { "kind": "Rect", "attrs": { "x": 0, "y": 0, "height": 20, "width": 30 } } }, "textures": { "on": { "state": { "fill": "darkgreen", "stroke": "red", "strokeWidth": 0 }, "kind": "fill" }, "off": { "state": { "fill": "rgba(0,0,0,0)", "stroke": "black", "strokeWidth": 0 }, "kind": "fill" } } }, "state": { "name": "R2", "scale": { "x": 1, "y": 1 }, "inputMap": { "button": { "controllerId": "3b0c5fc7-c9a9-41d8-ad57-dc1385d7d1c3", "key": "r2" } }, "position": { "x": 200, "y": 45 } }, "filters": {} }], "width": 200, "height": 100, "v": "1", "backgroundColor": "rgb(0,255,0)" }';

const projectToPersistentState = (state: T.EditorState): PersistentState => ({
  savedDisplays: selectors.savedDisplaysState(state),
  controllers: selectors.controllers(state),
  local: selectors.localState(state),
});

export const serializeEditorState = (state: T.EditorState): string =>
  JSON.stringify(projectToPersistentState(state));

const recoverEditorState = (
  pState: PersistentState,
): Partial<T.EditorState> => {
  const { controllers, local, savedDisplays: rawSavedDisplays } = {
    ...defaultPersistentState,
    ...pState,
  };

  if (rawSavedDisplays.displays.length == 0) {
    // inject the katamari display by default if none exist
    rawSavedDisplays.displays.push(JSON.parse(DEFAULT_DISPLAY));
    rawSavedDisplays.selectedDisplayId = rawSavedDisplays.displays[0].id;
  }

  const savedDisplays: T.SavedDisplaysState = {
    ...rawSavedDisplays,
    displays: rawSavedDisplays.displays.map(portOutdatedDisplay),
  };

  const active = selectors.selectedDisplay.proj(savedDisplays);

  return {
    display: active && { active },
    input: { ...initialInputState, controllers },
    local,
    savedDisplays,
  };
};

export const deserializePersistentString = (
  str: string,
): Partial<T.EditorState> => recoverEditorState(JSON.parse(str));
