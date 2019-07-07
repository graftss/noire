import * as React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { bindActionCreators } from 'redux';

import * as T from '../../types';
import { selectComponent } from '../../state/actions';
import { find } from '../../utils';

interface ComponentOption {
  componentId?: string;
  value?: string;
  label: string;
}

interface PropsFromDispatch {
  selectComponent: (componentId: string) => void;
}

interface PropsFromState {
  options: ComponentOption[];
  selectedId: string;
}

interface ComponentSelectProps extends PropsFromState, PropsFromDispatch {}

const toOption = (c: T.SerializedComponent): ComponentOption => ({
  value: c.id,
  label: c.kind,
});

const mapStateToProps = (state: T.EditorState): PropsFromState => {
  return {
    selectedId: state.display.selectedComponentId,
    options: state.display.components.map(toOption),
  };
};

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators({ selectComponent }, dispatch);

const BaseComponentSelect: React.SFC<ComponentSelectProps> = ({
  selectedId,
  options,
  selectComponent,
}) => (
  <Select
    value={find(({ value }) => value === selectedId, options) || null}
    options={options}
    onChange={o => selectComponent(o.value)}
    placeholder="Components"
  />
);

export const ComponentSelect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseComponentSelect);
