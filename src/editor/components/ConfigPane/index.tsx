import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import * as actions from '../../../state/actions';
import * as selectors from '../../../state/selectors';
import { clipboard } from '../../../utils';
import { displayToString } from '../../../display/serialize';
import { DisplaySelect } from './DisplaySelect';
import { DisplayEditor } from './DisplayEditor';

interface PropsFromState {
  activeDisplay: T.SerializedDisplay;
  savedDisplays: T.SerializedDisplay[];
  selectedDisplay: Maybe<T.SerializedDisplay>;
}

interface PropsFromDispatch {
  createNewDisplay: CB0;
  enterPresentationMode: CB0;
  importDisplay: CB0;
  removeDisplay: CB1<T.SerializedDisplay>;
  saveDisplay: CB1<T.SerializedDisplay>;
  saveDisplayAsNew: CB1<T.SerializedDisplay>;
  selectExistingDisplay: CB1<T.SerializedDisplay>;
  setDisplayName: CB1<{ display: T.SerializedDisplay; name: string }>;
}

interface ConfigPaneProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  activeDisplay: selectors.activeDisplay(state),
  savedDisplays: selectors.savedDisplays(state),
  selectedDisplay: selectors.selectedDisplay(state),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(actions, dispatch);

const exportDisplay = (display: T.SerializedDisplay): Promise<void> =>
  clipboard.write(displayToString(display));

const BaseConfigPane: React.SFC<ConfigPaneProps> = ({
  activeDisplay,
  createNewDisplay,
  enterPresentationMode,
  importDisplay,
  removeDisplay,
  saveDisplay,
  saveDisplayAsNew,
  savedDisplays,
  selectExistingDisplay,
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
      selectDisplay={selectExistingDisplay}
      selectedDisplay={selectedDisplay}
    />
    <div>
      <button onClick={createNewDisplay}>create new display</button>
      <button onClick={() => saveDisplay(activeDisplay)}>
        {selectedDisplay === undefined ? 'save display as new' : 'save display'}
      </button>
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
