import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import { closePresentationSnackbar } from '../../../state/actions';
import {
  inPresentationMode,
  isPresentationSnackbarOpen,
} from '../../../state/selectors';
import { Editor } from './Editor';
import { PresentationSnackbar } from './PresentationSnackbar';

interface PropsFromState {
  inPresentationMode: boolean;
  isPresentationSnackbarOpen: boolean;
}

interface PropsFromDispatch {
  closePresentationSnackbar: () => void;
}

interface EditorContainerProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  inPresentationMode: inPresentationMode(state),
  isPresentationSnackbarOpen: isPresentationSnackbarOpen(state),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      closePresentationSnackbar,
    },
    dispatch,
  );

const BaseEditorContainer: React.SFC<EditorContainerProps> = ({
  inPresentationMode,
  isPresentationSnackbarOpen,
  closePresentationSnackbar,
}) => (
  <div>
    {inPresentationMode ? null : <Editor />}
    <PresentationSnackbar
      isOpen={isPresentationSnackbarOpen}
      close={closePresentationSnackbar}
    />
  </div>
);

export const EditorContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseEditorContainer);
