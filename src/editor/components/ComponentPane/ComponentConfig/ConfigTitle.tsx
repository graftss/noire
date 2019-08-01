import * as React from 'react';

interface ConfigTitleProps {
  label: string;
}

export const ConfigTitle: React.SFC<ConfigTitleProps> = ({ label }) => (
  <span>{label}</span>
);
