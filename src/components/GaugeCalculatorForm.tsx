import { useState } from "react";
import type { SwatchData, CalculationResult } from "../types/knitting.types";
import { calculateGauge } from "../utils/calculateGauge";
import { GaugeResult } from "./GaugeResult";

export function GaugeCalculatorForm() {
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
  // It starts as `null` because there's no result until the user clicks "Calculate".
  // The generic <CalculationResult | null> tells TypeScript this state can be
  // either a CalculationResult object OR null — nothing else.
  const [result, setResult] = useState<CalculationResult | null>(null);

  // This function runs when the user clicks the "Calculate" button.
  // It's the "bridge" between the UI (strings from inputs) and the pure
  // calculation logic (which expects numbers).
  function handleSubmit() {
    const data: SwatchData = {
      projectName,
      // Number(...) converts the string from the input into an actual number
      swatchStitches: Number(swatchStitches),
      swatchWidthCm: Number(swatchWidthCm),
      desiredWidthCm: Number(desiredWidthCm),

      // For optional fields: only convert to a number if the field isn't empty,
      // otherwise leave it as `undefined` (matching the `?` in SwatchData)
      swatchRows: swatchRows ? Number(swatchRows) : undefined,
      swatchHeightCm: swatchHeightCm ? Number(swatchHeightCm) : undefined,
      desiredHeightCm: desiredHeightCm ? Number(desiredHeightCm) : undefined,
    };
    // Call the pure function we already tested manually, and store its result
    setResult(calculateGauge(data));
  }

  return (
    <div>
      <h2>Knitting Gauge Calculator</h2>

      <label>
        Project name:
        {/* onChange fires on every keystroke. e.target.value is the current text.
            Calling setProjectName triggers a re-render with the new value. */}
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </label>

      <h3>Width</h3>

      <label>
        Gauge stitches
        <input
          type="number"
          value={swatchStitches}
          onChange={(e) => setSwatchStitches(e.target.value)}
        />
      </label>

      <label>
        Gauge width (cm):
        <input
          type="number"
          value={swatchWidthCm}
          onChange={(e) => setSwatchWidthCm(e.target.value)}
        />
      </label>

      <label>
        Desired width (cm):
        <input
          type="number"
          value={desiredWidthCm}
          onChange={(e) => setDesiredWidthCm(e.target.value)}
        />
      </label>
      <h3>Height (optional)</h3>

      <label>
        Swatch Rows:
        <input
          type="number"
          value={swatchRows}
          onChange={(e) => setSwatchRows(e.target.value)}
        />
      </label>

      <label>
        Swatch Height
        <input
          type="number"
          value={swatchHeightCm}
          onChange={(e) => setSwatchHeightCm(e.target.value)}
        />
      </label>

      <label>
        Desired height (cm):
        <input
          type="number"
          value={desiredHeightCm}
          onChange={(e) => setDesiredHeightCm(e.target.value)}
        />
      </label>

      <button onClick={handleSubmit}>Calculate</button>

      {/* This block only renders if `result` is not null.
    `&&` here works as a shortcut: if the left side is falsy (null),
     React skips rendering the right side entirely. */}

      {result && <GaugeResult result={result} />}
    </div>
  );
}
