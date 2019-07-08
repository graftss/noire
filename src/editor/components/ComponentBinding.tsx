import * as React from 'react';
import * as T from '../../types';

interface ComponentBindingProps {
  binding: T.Binding;
}

export const ComponentBinding: React.SFC<ComponentBindingProps> = ({
  binding,
}) => <div>{JSON.stringify(binding)}</div>;
