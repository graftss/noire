import * as React from 'react';
import * as T from '../../../types';

interface ComponentStateProps {
  component: T.SerializedComponent;
}

export const ComponentState: React.SFC<ComponentStateProps> = ({
  component,
}) => <div>{JSON.stringify(component.state)}</div>;
