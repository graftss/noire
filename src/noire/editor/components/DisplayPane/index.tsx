import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import * as selectors from '../../../state/selectors';
import * as actions from '../../../state/actions';
import { ComponentEditor } from '../ComponentEditor';
import { Section } from '../layout/Section';
import { ComponentSelect } from './ComponentSelect';
import { DisplayEditor } from './DisplayEditor';

interface PropsFromState {
  display: T.SerializedDisplay;
  components: T.SerializedComponent[];
  selectedComponent: Maybe<T.SerializedComponent>;
}

interface PropsFromDispatch {
  addDefaultComponent: CB1<T.ComponentKind>;
  exportDisplay: CB1<T.SerializedDisplay>;
  importComponent: CB0;
  saveDisplay: CB1<T.SerializedDisplay>;
  selectComponent: CB1<string>;
  updateDisplayField: CB1<{
    display: T.SerializedDisplay;
    field: T.DisplayField;
  }>;
}

interface DisplayPaneProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state): PropsFromState => ({
  components: selectors.components(state),
  display: selectors.activeDisplay(state),
  selectedComponent: selectors.selectedComponent(state),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(actions, dispatch);

const BaseDisplayPane: React.SFC<DisplayPaneProps> = ({
  addDefaultComponent,
  components,
  display,
  exportDisplay,
  importComponent,
  saveDisplay,
  selectComponent,
  selectedComponent,
  updateDisplayField,
}) => (
  <div>
    <Section>
      <DisplayEditor
        addComponent={addDefaultComponent}
        display={display}
        exportDisplay={exportDisplay}
        importComponent={importComponent}
        saveDisplay={saveDisplay}
        updateDisplayField={updateDisplayField}
      />
    </Section>
    <Section>
      <ComponentSelect
        components={components}
        selected={selectedComponent}
        selectComponent={selectComponent}
      />
    </Section>
    {selectedComponent === undefined ? null : (
      <ComponentEditor component={selectedComponent} />
    )}
  </div>
);

export const DisplayPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseDisplayPane);
