import * as React from 'react';

interface FixedFieldProps {
  label: string;
}

export const FixedField: React.SFC<FixedFieldProps> = ({ label }) => (
  <span>{label}</span>
);
