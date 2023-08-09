import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import * as actions from '../../../state/actions';
import * as selectors from '../../../state/selectors';
import { DisplaySelect } from './DisplaySelect';
import { FpsSelect } from './FpsSelect';

interface PropsFromState {
  activeDisplay: T.SerializedDisplay;
  fps: number;
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
  setFps: CB1<number>;
}

interface ConfigPaneProps extends PropsFromState, PropsFromDispatch { }

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  activeDisplay: selectors.activeDisplay(state),
  fps: selectors.fps(state),
  savedDisplays: selectors.savedDisplays(state),
  selectedDisplay: selectors.selectedDisplay(state),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(actions, dispatch);

const BaseConfigPane: React.SFC<ConfigPaneProps> = ({
  activeDisplay,
  createNewDisplay,
  enterPresentationMode,
  fps,
  importDisplay,
  removeDisplay,
  saveDisplay,
  saveDisplayAsNew,
  savedDisplays,
  selectExistingDisplay,
  selectedDisplay,
  setFps,
}) => (
  <div>
    <div>
      <button onClick={enterPresentationMode}>hide editor</button>
      <button onClick={importDisplay}>import display</button>
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
    <div>
      <FpsSelect fps={fps} setFps={setFps} />
    </div>
  </div>
);

export const ConfigPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseConfigPane);
