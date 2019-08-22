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
import { ComponentSelect } from './ComponentSelect';
import { ComponentAdd } from './ComponentAdd';

interface PropsFromState {
  components: T.SerializedComponent[];
  selectedComponent: Maybe<T.SerializedComponent>;
}

interface PropsFromDispatch {
  addComponent: (kind: T.ComponentKind) => void;
  selectComponent: (id: string) => void;
}

interface ComponentPaneProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state): PropsFromState => ({
  components: selectors.components(state),
  selectedComponent: selectors.selectedComponent(state),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch => ({
  addComponent: (kind: T.ComponentKind) => {
    const component = defaultSerializedComponent(kind);
    const event = events.requestAddComponent(deserializeComponent(component));

    dispatch(actions.addComponent(component));
    dispatch(actions.emitDisplayEvents([event]));
  },

  selectComponent(id: string) {
    dispatch(actions.selectComponent(id));
    dispatch(actions.emitDisplayEvents([events.requestSelectComponent(id)]));
  },
});

const BaseComponentPane: React.SFC<ComponentPaneProps> = ({
  addComponent,
  components,
  selectComponent,
  selectedComponent,
}) => (
  <div>
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

export const ComponentPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseComponentPane);
