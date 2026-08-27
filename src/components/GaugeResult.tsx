import type { CalculationResult } from "../types/knitting.types";

// This defines the "shape" of the props this component expects to receive.
// Think of it like a function's parameter types, but for a component.
interface GaugeResultProps {
  result: CalculationResult;
}

export function GaugeResult({ result }: GaugeResultProps) {
  return (
    <div>
      <p>Required Stitches: {result.requiredStitches}</p>
      {result.requiredRows !== undefined && (
        <p>Required Rows: {result.requiredRows}</p>
      )}
    </div>
  );
}
