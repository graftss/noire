import * as React from 'react';

interface ComponentTitleProps {
  label: string;
}

export const ComponentTitle: React.SFC<ComponentTitleProps> = ({ label }) => (
  <span>{label}</span>
);
