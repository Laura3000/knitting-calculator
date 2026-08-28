import type { CalculationResult } from "../types/knitting.types";

interface GaugeResultProps {
  projectName: string;
  result: CalculationResult;
}

export function GaugeResult({ projectName, result }: GaugeResultProps) {
  return (
    <div>
      <h3>{projectName}</h3>
      <p>Required stitches: {result.requiredStitches}</p>
      {result.requiredRows !== undefined && (
        <p>Required rows: {result.requiredRows}</p>
      )}
    </div>
  );
}
