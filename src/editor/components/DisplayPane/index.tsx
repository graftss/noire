import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import * as selectors from '../../../state/selectors';
import * as actions from '../../../state/actions';
import { ComponentEditor } from '../ComponentEditor';
import { CanvasEditor } from './CanvasEditor';
import { ComponentSelect } from './ComponentSelect';
import { ComponentAdd } from './ComponentAdd';

interface PropsFromState {
  display: T.SerializedDisplay;
  components: T.SerializedComponent[];
  selectedComponent: Maybe<T.SerializedComponent>;
}

interface PropsFromDispatch {
  addDefaultComponent: CB1<T.ComponentKind>;
  saveDisplay: CB1<T.SerializedDisplay>;
  selectComponent: CB1<string>;
  setCanvasDimensions: CB1<{ width: number; height: number }>;
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
  saveDisplay,
  selectComponent,
  selectedComponent,
  setCanvasDimensions,
}) => (
  <div>
    <CanvasEditor display={display} setCanvasDimensions={setCanvasDimensions} />
    <div>
      <button onClick={() => saveDisplay(display)}>save display</button>
    </div>
    <ComponentAdd addComponent={addDefaultComponent} />
    <ComponentSelect
      components={components}
      selected={selectedComponent}
      selectComponent={selectComponent}
    />
    {selectedComponent === undefined ? null : (
      <ComponentEditor component={selectedComponent} />
    )}
  </div>
);

export const DisplayPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseDisplayPane);
