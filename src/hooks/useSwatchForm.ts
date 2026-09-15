import { useState } from "react";
import type { SwatchData, CalculationResult } from "../types/knitting.types";
import { calculateGauge } from "../utils/calculateGauge";
import { validateSwatchData } from "../utils/validateSwatchData";

export function useSwatchForm(initialData?: SwatchData) {
  const [projectName, setProjectName] = useState(initialData?.projectName ?? "");
  const [swatchStitches, setSwatchStitches] = useState(String(initialData?.swatchStitches ?? ""));
  const [swatchWidthCm, setSwatchWidthCm] = useState(String(initialData?.swatchWidthCm ?? ""));
  const [desiredWidthCm, setDesiredWidthCm] = useState(String(initialData?.desiredWidthCm ?? ""));
  const [swatchRows, setSwatchRows] = useState(String(initialData?.swatchRows ?? ""));
  const [swatchHeightCm, setSwatchHeightCm] = useState(String(initialData?.swatchHeightCm ?? ""));
  const [desiredHeightCm, setDesiredHeightCm] = useState(String(initialData?.desiredHeightCm ?? ""));
  const [yarnName, setYarnName] = useState(initialData?.yarnName ?? "");
  const [needleSize, setNeedleSize] = useState(initialData?.needleSize ?? "");

  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Holds the exact SwatchData that produced the current `result`.
  // We'll need this later if the user decides to save this calculation.
  const [lastData, setLastData] = useState<SwatchData | null>(null);

  function handleSubmit() {
    const data: SwatchData = {
      projectName,
      swatchStitches: Number(swatchStitches),
      swatchWidthCm: Number(swatchWidthCm),
      desiredWidthCm: Number(desiredWidthCm),
      swatchRows: swatchRows ? Number(swatchRows) : undefined,
      swatchHeightCm: swatchHeightCm ? Number(swatchHeightCm) : undefined,
      desiredHeightCm: desiredHeightCm ? Number(desiredHeightCm) : undefined,
      yarnName: yarnName || undefined,
      needleSize: needleSize || undefined,
    };

    const validationErrors = validateSwatchData(data);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setResult(null);
      setLastData(null);
      return;
    }

    setErrors([]);
    setResult(calculateGauge(data));
    setLastData(data);
  }

  function handleReset() {
    setResult(null);
    setErrors([]);
    setLastData(null);
    setProjectName("");
    setSwatchStitches("");
    setSwatchWidthCm("");
    setDesiredWidthCm("");
    setSwatchRows("");
    setSwatchHeightCm("");
    setDesiredHeightCm("");
    setYarnName("");
    setNeedleSize("");
  }

  return {
    projectName,
    setProjectName,
    swatchStitches,
    setSwatchStitches,
    swatchWidthCm,
    setSwatchWidthCm,
    desiredWidthCm,
    setDesiredWidthCm,
    swatchRows,
    setSwatchRows,
    swatchHeightCm,
    setSwatchHeightCm,
    desiredHeightCm,
    setDesiredHeightCm,
    yarnName,
    setYarnName,
    needleSize,
    setNeedleSize,
    errors,
    result,
    lastData,
    handleSubmit,
    handleReset,
  };
}
