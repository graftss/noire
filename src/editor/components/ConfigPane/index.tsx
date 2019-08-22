import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../state/actions';

interface PropsFromState {}

interface PropsFromDispatch {
  enterPresentationMode: () => void;
}

interface ConfigPaneProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state): PropsFromState => ({});

const mapDispatchToProps = (dispatch): PropsFromDispatch => ({
  enterPresentationMode: () => {
    dispatch(actions.enterPresentationMode());
    setTimeout(() => dispatch(actions.closePresentationSnackbar()), 1000);
  },
});

const BaseConfigPane: React.SFC<ConfigPaneProps> = ({
  enterPresentationMode,
}) => (
  <div>
    <div>config</div>
    <div>
      <button onClick={enterPresentationMode}>hide editor</button>
    </div>
  </div>
);

export const ConfigPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseConfigPane);
