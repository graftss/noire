import * as React from 'react';

export interface HelloProps { name: string; }

export const Hello = (props: HelloProps) => (
  <div>hello {name}</div>
);

const x: any = {};
console.log(x.y.z)
