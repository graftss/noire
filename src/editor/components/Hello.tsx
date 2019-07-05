import * as React from 'react';

export interface HelloProps {
  name: string;
}

export const Hello: React.SFC<HelloProps> = (props: HelloProps) => (
  <div>hello {props.name}</div>
);
