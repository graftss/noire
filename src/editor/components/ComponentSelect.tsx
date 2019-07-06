import * as React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { bindActionCreators } from 'redux';

import * as T from '../../canvas/types';
import { EditorState } from '../../state/types';
import { selectComponent } from '../../state/actions';
import { find } from '../../utils';

interface ComponentOption {
  componentId?: string;
  value?: string;
  label: string;
};

interface ComponentSelectProps {
  options: ComponentOption[];
  selectedId: string;
  selectComponent: (componentId: string) => void;
}

const toOption = (c: T.SerializedComponent): ComponentOption => ({
  value: c.baseConfig.componentId,
  label: c.kind,
});

const emptyOption = { label: '--' };

const mapStateToProps = (state: EditorState) => {
  return ({
    selectedId: state.display.selectedComponentId,
    options: state.display.components.map(toOption),
  });
};

const mapDispatchToProps = dispatch => bindActionCreators({ selectComponent }, dispatch);

const BaseComponentSelect: React.SFC<ComponentSelectProps> = ({ selectedId, options, selectComponent }) => (
  <Select
    value={find(({ value }) => value === selectedId, options) || null}
    options={options}
    onChange={o => selectComponent(o.value)}
    placeholder="Components"
  />
);

export const ComponentSelect = connect(mapStateToProps, mapDispatchToProps)(BaseComponentSelect);
