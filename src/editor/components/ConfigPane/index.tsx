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
} from '../../../display/serialize';
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
  importDisplayFromString: (displayString: string) => void;
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

const mapDispatchToProps = (dispatch): PropsFromDispatch => ({
  createNewDisplay: () => {
    const display = newDisplay();

    dispatch(actions.saveDisplay(display));
    dispatch(actions.selectDisplay(display.id));
  },

  enterPresentationMode: () => {
    dispatch(actions.enterPresentationMode());
    setTimeout(() => dispatch(actions.closePresentationSnackbar()), 1000);
  },

  importDisplayFromString: (displayString: string) => {},

  removeDisplay: (display: T.SerializedDisplay) => {
    dispatch(actions.removeDisplay(display.id));
  },

  saveDisplay: (display: T.SerializedDisplay) => {
    dispatch(actions.saveDisplay(display));
    dispatch(actions.selectDisplay(display.id));
  },

  saveDisplayAsNew: (display: T.SerializedDisplay) => {
    const clonedDisplay = cloneDisplay(display);

    dispatch(actions.saveDisplay(clonedDisplay));
    dispatch(actions.selectDisplay(clonedDisplay.id));
  },

  selectDisplay: (display: T.SerializedDisplay) => {
    const event = events.requestLoadDisplay(display);

    dispatch(actions.selectDisplay(display.id));
    dispatch(actions.emitDisplayEvents([event]));
  },

  setDisplayName: (display: T.SerializedDisplay, name: string) => {
    const newDisplay = setDisplayName(display, name);
    dispatch(actions.saveDisplay(newDisplay));
  },
});

const BaseConfigPane: React.SFC<ConfigPaneProps> = ({
  activeDisplay,
  createNewDisplay,
  enterPresentationMode,
  removeDisplay,
  saveDisplay,
  saveDisplayAsNew,
  savedDisplays,
  selectDisplay,
  selectedDisplay,
  setDisplayName,
}) => (
  <div>
    <div>config</div>
    <div>
      <button onClick={enterPresentationMode}>hide editor</button>
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
      updateDisplayName={setDisplayName}
    />
  </div>
);

export const ConfigPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseConfigPane);
