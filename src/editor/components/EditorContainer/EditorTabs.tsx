import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs, Tab, AppBar } from '@material-ui/core';
import * as T from '../../../types';
import * as actions from '../../../state/actions';
import { tabOrder } from '../../../state/reducers/tab';

interface PropsFromState {
  currentTab: T.TabKind;
}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  currentTab: state.tab.kind,
});

interface PropsFromDispatch {
  closePresentationSnackbar: () => void;
  enterPresentationMode: () => void;
  setTab: (kind: T.TabKind) => void;
}

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      closePresentationSnackbar: actions.closePresentationSnackbar,
      enterPresentationMode: actions.enterPresentationMode,
      setTab: actions.setTab,
    },
    dispatch,
  );

interface EditorTabsProps extends PropsFromState, PropsFromDispatch {}

const kindToLabel: Record<T.TabKind, string> = {
  components: 'Components',
  controllers: 'Controllers',
  presentation: 'Hide editor',
};

const onChange = ({
  closePresentationSnackbar,
  setTab,
  enterPresentationMode,
}: EditorTabsProps) => (_, index) => {
  if (index === 0 || index === 1) {
    setTab(tabOrder[index]);
  } else if (index === 2) {
    enterPresentationMode();
    setTimeout(closePresentationSnackbar, 1000);
  }
};

const BaseEditorTabs: React.SFC<EditorTabsProps> = props => (
  <div>
    <AppBar position="static" color="default">
      <Tabs
        value={tabOrder.indexOf(props.currentTab)}
        onChange={onChange(props)}
        indicatorColor="primary"
        textColor="primary"
      >
        {tabOrder.map((kind: T.TabKind) => (
          <Tab key={kind} label={kindToLabel[kind]} />
        ))}
      </Tabs>
    </AppBar>
  </div>
);

export const EditorTabs = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseEditorTabs);
