import * as React from 'react';
import * as T from '../../../types';
import { RemapButton } from './RemapButton';

interface RemapButtonListProps {
  data: { label: string; value: T.RemapButtonValue }[];
}

export const RemapButtonList: React.SFC<RemapButtonListProps> = ({ data }) => (
  <table className="remap-button-list">
    <tbody>
      {data.map(({ label, value }, i) => (
        <tr key={i}>
          <td>{label}</td>
          <td>
            <RemapButton value={value} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
