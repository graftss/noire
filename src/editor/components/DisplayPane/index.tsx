import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import * as selectors from '../../../state/selectors';
import * as actions from '../../../state/actions';
import * as events from '../../../display/events';
import { ComponentEditor } from '../ComponentEditor';
import {
  defaultSerializedComponent,
  deserializeComponent,
} from '../../../display/component';
import { CanvasEditor } from './CanvasEditor';
import { ComponentSelect } from './ComponentSelect';
import { ComponentAdd } from './ComponentAdd';

interface PropsFromState {
  display: T.SerializedDisplay;
  components: T.SerializedComponent[];
  selectedComponent: Maybe<T.SerializedComponent>;
}

interface PropsFromDispatch {
  addComponent: (kind: T.ComponentKind) => void;
  saveDisplay: (display: T.SerializedDisplay) => void;
  selectComponent: (id: string) => void;
  setCanvasDimensions: (width: number, height: number) => void;
}

interface DisplayPaneProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state): PropsFromState => ({
  components: selectors.components(state),
  display: selectors.activeDisplay(state),
  selectedComponent: selectors.selectedComponent(state),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch => ({
  addComponent: (kind: T.ComponentKind) => {
    const component = defaultSerializedComponent(kind);
    const event = events.requestAddComponent(deserializeComponent(component));

    dispatch(actions.addComponent(component));
    dispatch(actions.emitDisplayEvents([event]));
  },

  saveDisplay: (display: T.SerializedDisplay) => {
    dispatch(actions.saveDisplay(display));
  },

  selectComponent(id: string) {
    dispatch(actions.selectComponent(id));
    dispatch(actions.emitDisplayEvents([events.requestSelectComponent(id)]));
  },

  setCanvasDimensions: (width: number, height: number) => {
    const event = events.requestSetCanvasDimensions(width, height);

    dispatch(actions.setCanvasDimensions(width, height));
    dispatch(actions.emitDisplayEvents([event]));
  },
});

const BaseDisplayPane: React.SFC<DisplayPaneProps> = ({
  addComponent,
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
    <ComponentAdd addComponent={addComponent} />
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
