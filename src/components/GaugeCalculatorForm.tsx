import { useState } from "react";
import type { SwatchData, CalculationResult } from "../types/knitting.types";
import { calculateGauge } from "../utils/calculateGauge";
import { GaugeResult } from "./GaugeResult";
import { validateSwatchData } from "../utils/validateSwatchData";
import { NumberField } from "./NumberField";

export function GaugeCalculatorForm() {
  // Holds the list of validation error messages (empty = no errors)
  const [errors, setErrors] = useState<string[]>([]);

  // Each input field gets its own piece of state.
  // We store everything as strings because that's what an <input> gives us,
  // even for fields that represent numbers.
  const [projectName, setProjectName] = useState("");
  const [swatchStitches, setSwatchStitches] = useState("");
  const [swatchWidthCm, setSwatchWidthCm] = useState("");
  const [desiredWidthCm, setDesiredWidthCm] = useState("");

  // Optional fields (rows/height), same pattern as above
  const [swatchRows, setSwatchRows] = useState("");
  const [swatchHeightCm, setSwatchHeightCm] = useState("");
  const [desiredHeightCm, setDesiredHeightCm] = useState("");

  // This state holds the calculation result.
  // It also doubles as our "which screen to show" flag:
  // null = show the form, not null = show the result screen.
  const [result, setResult] = useState<CalculationResult | null>(null);

  // This function runs when the user clicks the "Calculate" button.
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

  // Clears the result, sending the user back to the form.
  function handleReset() {
    setResult(null);
    setErrors([]);
    // Reset every form field back to its initial empty value
    setProjectName("");
    setSwatchStitches("");
    setSwatchWidthCm("");
    setDesiredWidthCm("");
    setSwatchRows("");
    setSwatchHeightCm("");
    setDesiredHeightCm("");
  }

  // If we already have a result, show only the result screen
  if (result) {
    return (
      <div>
        <GaugeResult projectName={projectName} result={result} />
        <button onClick={handleReset}>Start over</button>
      </div>
    );
  }

  // Otherwise, show the form
  return (
    <div>
      <h2>Knitting Gauge Calculator</h2>

      <label>
        Project name:
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </label>

      <h3>Width</h3>

      <NumberField
        label="Gauge stitches"
        value={swatchStitches}
        onChange={setSwatchStitches}
      />

      <NumberField
        label="Gauge width (cm)"
        value={swatchWidthCm}
        onChange={setSwatchWidthCm}
      />

      <NumberField
        label="Desired width (cm)"
        value={desiredWidthCm}
        onChange={setDesiredWidthCm}
      />

      <h3>Height (optional)</h3>

      <NumberField
        label="Swatch rows"
        value={swatchRows}
        onChange={setSwatchRows}
      />

      <NumberField
        label="Swatch height (cm)"
        value={swatchHeightCm}
        onChange={setSwatchHeightCm}
      />

      <NumberField
        label="Desired height (cm)"
        value={desiredHeightCm}
        onChange={setDesiredHeightCm}
      />

      <button onClick={handleSubmit}>Calculate</button>

      {/* .map() renders a list of items. React requires a unique "key" prop
          on each item so it can track which ones changed between renders. */}
      {errors.length > 0 && (
        <ul>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
