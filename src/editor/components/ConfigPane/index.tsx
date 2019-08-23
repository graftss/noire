import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import * as actions from '../../../state/actions';
import * as selectors from '../../../state/selectors';
import { DisplaySelect } from './DisplaySelect';

interface PropsFromState {
  activeDisplay: T.SerializedDisplay;
  savedDisplays: T.SerializedDisplay[];
  selectedDisplay: Maybe<T.SerializedDisplay>;
}

interface PropsFromDispatch {
  enterPresentationMode: () => void;
  saveCurrentDisplay: () => void;
  selectDisplay: (id: string) => void;
}

interface ConfigPaneProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  activeDisplay: selectors.activeDisplay(state),
  savedDisplays: selectors.savedDisplays(state),
  selectedDisplay: selectors.selectedDisplay(state),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch => ({
  enterPresentationMode: () => {
    dispatch(actions.enterPresentationMode());
    setTimeout(() => dispatch(actions.closePresentationSnackbar()), 1000);
  },

  saveCurrentDisplay: () => {},

  selectDisplay: (id: string) => {
    dispatch(actions.selectDisplay(id));
  },
});

const BaseConfigPane: React.SFC<ConfigPaneProps> = ({
  enterPresentationMode,
  savedDisplays,
  selectDisplay,
  selectedDisplay,
}) => (
  <div>
    <div>config</div>
    <div>
      <button onClick={enterPresentationMode}>hide editor</button>
    </div>
    <DisplaySelect displays={savedDisplays} selectedDisplay={selectedDisplay} />
  </div>
);

export const ConfigPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseConfigPane);
