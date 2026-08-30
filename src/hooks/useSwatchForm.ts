import { useState } from 'react';
import type { SwatchData, CalculationResult } from '../types/knitting.types';
import { calculateGauge } from '../utils/calculateGauge';
import { validateSwatchData } from '../utils/validateSwatchData';

export function useSwatchForm() {
  const [projectName, setProjectName] = useState('');
  const [swatchStitches, setSwatchStitches] = useState('');
  const [swatchWidthCm, setSwatchWidthCm] = useState('');
  const [desiredWidthCm, setDesiredWidthCm] = useState('');
  const [swatchRows, setSwatchRows] = useState('');
  const [swatchHeightCm, setSwatchHeightCm] = useState('');
  const [desiredHeightCm, setDesiredHeightCm] = useState('');

  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<CalculationResult | null>(null);

  function handleSubmit() {
    const data: SwatchData = {
      projectName,
      swatchStitches: Number(swatchStitches),
      swatchWidthCm: Number(swatchWidthCm),
      desiredWidthCm: Number(desiredWidthCm),
      swatchRows: swatchRows ? Number(swatchRows) : undefined,
      swatchHeightCm: swatchHeightCm ? Number(swatchHeightCm) : undefined,
      desiredHeightCm: desiredHeightCm ? Number(desiredHeightCm) : undefined,
    };

    const validationErrors = validateSwatchData(data);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setResult(null);
      return;
    }

    setErrors([]);
    setResult(calculateGauge(data));
  }

  function handleReset() {
    setResult(null);
    setErrors([]);
    setProjectName('');
    setSwatchStitches('');
    setSwatchWidthCm('');
    setDesiredWidthCm('');
    setSwatchRows('');
    setSwatchHeightCm('');
    setDesiredHeightCm('');
  }

  // Everything the component needs, bundled into one object
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
    errors,
    result,
    handleSubmit,
    handleReset,
  };
}
