import type { SwatchData, CalculationResult } from "../types/knitting.types";

export function calculateGauge(data: SwatchData): CalculationResult {
  const requiredStitches = Math.round(
    (data.swatchStitches * data.desiredWidthCm) / data.swatchWidthCm,
  );

  const result: CalculationResult = { requiredStitches };

  if (data.swatchRows && data.swatchHeightCm && data.desiredHeightCm) {
    result.requiredRows = Math.round(
      (data.swatchRows * data.desiredHeightCm) / data.swatchHeightCm,
    );
  }

  return result;
}
