import { useState } from "react";
import type { SwatchData, CalculationResult, SavedProject } from "../../types/knitting.types";
import { GaugeResult } from "./GaugeResult";
import { NumberField } from "../form/NumberField";
import { TextField } from "../form/TextField";
import { useSwatchForm } from "../../hooks/useSwatchForm";
import styles from "./GaugeCalculatorForm.module.css";

interface GaugeCalculatorFormProps {
  onSaveProject: (data: SwatchData, result: CalculationResult) => boolean;
  editingProject?: SavedProject | null;
  onCancelEdit?: () => void;
}

export function GaugeCalculatorForm({
  onSaveProject,
  editingProject,
  onCancelEdit,
}: GaugeCalculatorFormProps) {
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
    yarnName,
    setYarnName,
    needleSize,
    setNeedleSize,
    errors,
    result,
    lastData,
    handleSubmit,
    handleReset,
  } = useSwatchForm(editingProject?.data);

  // Tracks whether the current result has already been saved,
  // just so we can show a small confirmation on the button.
  const [saved, setSaved] = useState(false);
  const editingNotice = editingProject ? (
    <p>Editing project: <strong>{editingProject.data.projectName || "Untitled project"}</strong></p>
  ) : null;

  function handleSave() {
    if (!lastData || !result) {
      return;
    }
    setSaved(onSaveProject(lastData, result));
  }

  function handleResetAndClearSaved() {
    setSaved(false);
    handleReset();
  }

  if (result) {
    return (
      <div className={styles.container}>
        {editingNotice}
        <GaugeResult
          projectName={projectName}
          result={result}
          yarnName={yarnName}
          needleSize={needleSize}
        />

        <div className={styles.buttonWrapper}>
          <button
            className={styles.button}
            onClick={handleSave}
            disabled={saved}
          >
            {saved ? "Saved!" : editingProject ? "Save Changes" : "Save project"}
          </button>
          <button className={styles.button} onClick={editingProject ? onCancelEdit : handleResetAndClearSaved}>
            {editingProject ? "Cancel editing" : "Start over"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.container} noValidate onSubmit={(event) => { event.preventDefault(); handleSubmit(); }}>
      <h2>Your swatch &amp; measurements</h2>
      {editingNotice}

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

      <h3>Materials (optional)</h3>

      <div className={styles.materialsRow}>
        <TextField
          label="Yarn name/brand"
          value={yarnName}
          onChange={setYarnName}
        />
        <TextField
          label="Needle size"
          value={needleSize}
          onChange={setNeedleSize}
        />
      </div>

      <div className={styles.buttonWrapper}>
        <button className={styles.button} type="submit">
          Calculate
        </button>
        {editingProject && (
          <button className={styles.button} type="button" onClick={onCancelEdit}>
            Cancel editing
          </button>
        )}
      </div>

      {errors.length > 0 && (
        <ul className={styles.errorList} role="alert">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
