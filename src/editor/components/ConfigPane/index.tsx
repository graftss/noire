import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import * as actions from '../../../state/actions';
import * as events from '../../../display/events';
import * as selectors from '../../../state/selectors';
import {
  cloneDisplay,
  newDisplay,
  setDisplayName,
  displayToString,
  stringToDisplay,
} from '../../../display/serialize';
import { clipboard } from '../../../utils';
import { DisplaySelect } from './DisplaySelect';
import { DisplayEditor } from './DisplayEditor';

interface PropsFromState {
  activeDisplay: T.SerializedDisplay;
  savedDisplays: T.SerializedDisplay[];
  selectedDisplay: Maybe<T.SerializedDisplay>;
}

interface PropsFromDispatch {
  createNewDisplay: () => void;
  enterPresentationMode: () => void;
  exportDisplay: (display: T.SerializedDisplay) => void;
  importDisplay: () => void;
  removeDisplay: (display: T.SerializedDisplay) => void;
  saveDisplay: (display: T.SerializedDisplay) => void;
  saveDisplayAsNew: (display: T.SerializedDisplay) => void;
  selectDisplay: (display: T.SerializedDisplay) => void;
  setDisplayName: (display: T.SerializedDisplay, name: string) => void;
}

interface ConfigPaneProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  activeDisplay: selectors.activeDisplay(state),
  savedDisplays: selectors.savedDisplays(state),
  selectedDisplay: selectors.selectedDisplay(state),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch => {
  const selectDisplay = (
    display: T.SerializedDisplay,
    saveToState: boolean = false,
    loadIntoCanvas: boolean = false,
  ): void => {
    dispatch(actions.selectDisplay(display.id));
    if (saveToState) dispatch(actions.saveDisplay(display));
    if (loadIntoCanvas) {
      const event = events.requestLoadDisplay(display);
      dispatch(actions.emitDisplayEvents([event]));
    }
  };

  return {
    createNewDisplay: () => selectDisplay(newDisplay(), true, true),

    enterPresentationMode: () => {
      dispatch(actions.enterPresentationMode());
      setTimeout(() => dispatch(actions.closePresentationSnackbar()), 1000);
    },

    exportDisplay: (display: T.SerializedDisplay) => {
      clipboard.write(displayToString(display));
    },

    importDisplay: () => {
      clipboard
        .read()
        .then(stringToDisplay)
        .then(
          display =>
            display && selectDisplay(cloneDisplay(display, false), true, true),
        );
    },

    removeDisplay: (display: T.SerializedDisplay) => {
      dispatch(actions.removeDisplay(display.id));
    },

    saveDisplay: (display: T.SerializedDisplay) => {
      selectDisplay(display, true);
    },

    saveDisplayAsNew: (display: T.SerializedDisplay) => {
      selectDisplay(cloneDisplay(display), true);
    },

    selectDisplay: (display: T.SerializedDisplay) => {
      selectDisplay(display, false, true);
    },

    setDisplayName: (display: T.SerializedDisplay, name: string) => {
      const newDisplay = setDisplayName(display, name);
      dispatch(actions.saveDisplay(newDisplay));
    },
  };
};

const BaseConfigPane: React.SFC<ConfigPaneProps> = ({
  activeDisplay,
  createNewDisplay,
  enterPresentationMode,
  exportDisplay,
  importDisplay,
  removeDisplay,
  saveDisplay,
  saveDisplayAsNew,
  savedDisplays,
  selectDisplay,
  selectedDisplay,
  setDisplayName,
}) => (
  <div>
    <div>
      <button onClick={enterPresentationMode}>hide editor</button>
      <button onClick={importDisplay}>import display from clipboard</button>
    </div>
    <DisplaySelect
      displays={savedDisplays}
      selectDisplay={selectDisplay}
      selectedDisplay={selectedDisplay}
    />
    <div>
      <button onClick={() => createNewDisplay()}>create new display</button>
      <button onClick={() => saveDisplay(activeDisplay)}>save display</button>
      <button onClick={() => saveDisplayAsNew(activeDisplay)}>
        clone display
      </button>
      {selectedDisplay && (
        <button onClick={() => removeDisplay(selectedDisplay)}>
          remove display
        </button>
      )}
    </div>
    <DisplayEditor
      display={selectedDisplay}
      exportDisplay={exportDisplay}
      updateDisplayName={setDisplayName}
    />
  </div>
);

export const ConfigPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseConfigPane);
