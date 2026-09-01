import type { CalculationResult } from "../../types/knitting.types";

interface GaugeResultProps {
  projectName: string;
  result: CalculationResult;
  yarnName?: string;
  needleSize?: string;
}

export function GaugeResult({
  projectName,
  result,
  yarnName,
  needleSize,
}: GaugeResultProps) {
  return (
    <div>
      <h3>{projectName}</h3>
      <p>
        <b>Required stitches:</b> {result.requiredStitches}
      </p>
      {result.requiredRows !== undefined && (
        <p>
          <b>Required rows:</b> {result.requiredRows}
        </p>
      )}
      {yarnName && (
        <p>
          <b>Yarn:</b> {yarnName}
        </p>
      )}
      {needleSize && (
        <p>
          <b>Needle size:</b> {needleSize}
        </p>
      )}
    </div>
  );
}
