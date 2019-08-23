import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import { ControllerPane } from '../ControllerPane';
import { ComponentPane } from '../ComponentPane';
import { ConfigPane } from '../ConfigPane';
import { AboutPane } from '../AboutPane';

interface PropsFromState {
  currentTab: T.TabKind;
}

type RouterProps = PropsFromState;

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  currentTab: state.tab.kind,
});

const tabSwitch = (kind: T.TabKind): React.ReactNode => {
  switch (kind) {
    case 'display':
      return <ComponentPane />;
    case 'controllers':
      return <ControllerPane />;
    case 'config':
      return <ConfigPane />;
    case 'about':
      return <AboutPane />;
  }
};

const BaseEditorRouter: React.SFC<RouterProps> = ({ currentTab }) => (
  <div>{tabSwitch(currentTab)}</div>
);

export const EditorRouter = connect(mapStateToProps)(BaseEditorRouter);
