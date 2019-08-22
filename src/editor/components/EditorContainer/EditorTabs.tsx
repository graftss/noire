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
  setTab: (kind: T.TabKind) => void;
}

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      setTab: actions.setTab,
    },
    dispatch,
  );

interface EditorTabsProps extends PropsFromState, PropsFromDispatch {}

const kindToLabel: Record<T.TabKind, string> = {
  components: 'Components',
  controllers: 'Controllers',
  config: 'Config',
};

const BaseEditorTabs: React.SFC<EditorTabsProps> = ({ currentTab, setTab }) => (
  <div>
    <AppBar position="static" color="default">
      <Tabs
        value={tabOrder.indexOf(currentTab)}
        onChange={(_, index) => setTab(tabOrder[index])}
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
