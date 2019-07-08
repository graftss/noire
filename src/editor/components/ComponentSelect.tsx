import * as React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { bindActionCreators } from 'redux';

import * as T from '../../types';
import { find } from '../../utils';

interface ComponentOption {
  componentId?: string;
  value?: string;
  label: string;
}

interface ComponentSelectProps {
  select: (componentId: string) => void;
  components: T.SerializedComponent[];
  selected: T.SerializedComponent;
}

const toOption = (c: T.SerializedComponent): ComponentOption | undefined => !c ? undefined : ({
  value: c.id,
  label: c.kind,
});

export const ComponentSelect: React.SFC<ComponentSelectProps> = ({
  selected,
  components,
  select,
}) => (
  <Select
    value={toOption(selected) || null}
    options={components.map(toOption)}
    onChange={o => { console.log(select, o); select(o.value)}}
    placeholder="Components"
  />
);
