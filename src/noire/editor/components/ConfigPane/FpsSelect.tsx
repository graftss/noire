import * as React from 'react';
import { SelectField } from '../controls/SelectField';

interface FpsSelectProps {
  fps: number;
  setFps: CB1<number>;
}

interface FpsOption {
  label: string;
  value: string;
}

const toOption = (fps: string): FpsOption => ({
  value: fps,
  label: fps,
});

export const FpsSelect: React.SFC<FpsSelectProps> = ({ setFps, fps }) => (
  <div className="flex-container">
    <span className="center">input display fps:</span>
    <span className="flex-rest">
      <SelectField
        autoConfirm={true}
        buttonText=""
        data={[20, 30, 40, 50, 60]}
        initialValue={fps}
        onConfirm={setFps}
        placeholder="saved displays"
        toOption={fps => toOption(fps.toString())}
      />
    </span>
  </div>
);
