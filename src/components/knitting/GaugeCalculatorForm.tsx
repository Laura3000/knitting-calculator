import { GaugeResult } from "./GaugeResult";
import { NumberField } from "../form/NumberField";
import { useSwatchForm } from "../../hooks/useSwatchForm";
import { TextField } from "../form/TextFIeld";
import styles from "./GaugeCalculatorForm.module.css";

export function GaugeCalculatorForm() {
  const {
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
  } = useSwatchForm();

  // If we already have a result, show only the result screen
  if (result) {
    return (
      <div className={styles.container}>
        <GaugeResult projectName={projectName} result={result} />
        <div className={styles.buttonWrapper}>
          <button className={styles.button} onClick={handleReset}>
            Start over
          </button>
        </div>
      </div>
    );
  }

  // Otherwise, show the form
  return (
    <div className={styles.container}>
      <h2>Knitting Gauge Calculator</h2>

      <TextField
        label="Project name"
        value={projectName}
        onChange={setProjectName}
      />

      <h3>Width</h3>

      <div className={styles.row}>
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
      </div>

      <h3>Height (optional)</h3>

      <div className={styles.row}>
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
      </div>

      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={handleSubmit}>
          Calculate
        </button>
      </div>

      {errors.length > 0 && (
        <ul className={styles.errorList}>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
