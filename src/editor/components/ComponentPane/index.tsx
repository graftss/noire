import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import * as selectors from '../../../state/selectors';
import * as actions from '../../../state/actions';
import * as events from '../../../display/events';
import { ComponentEditor } from '../ComponentEditor';
import { ComponentSelect } from './ComponentSelect';

interface PropsFromState {
  components: T.SerializedComponent[];
  selectedComponent: Maybe<T.SerializedComponent>;
}

interface PropsFromDispatch {
  selectComponent: (id: string) => void;
}

interface ComponentPaneProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state): PropsFromState => ({
  components: selectors.components(state),
  selectedComponent: selectors.selectedComponent(state),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch => ({
  selectComponent(id: string) {
    dispatch(actions.selectComponent(id));
    dispatch(actions.emitDisplayEvents([events.requestSelectComponent(id)]));
  },
});

const BaseComponentPane: React.SFC<ComponentPaneProps> = ({
  components,
  selectComponent,
  selectedComponent,
}) => (
  <div>
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
