// Represents the swatch (gauge sample) data the user measured
export interface SwatchData {
  projectName: string; // the name the user gave to her project

  swatchStitches: number; // how many stitches she knitted
  swatchWidthCm: number; // how many cm that swatch measured
  desiredWidthCm: number; // how many cm she wants the final piece to be

  // Optional fields, for anyone who also wants to calculate rows/height
  swatchRows?: number;
  swatchHeightCm?: number;
  desiredHeightCm?: number;

  // New: information about the materials used (optional, not used in calculations)
  yarnName?: string;
  needleSize?: string;
}

// Represents the result the calculator will return
export interface CalculationResult {
  requiredStitches: number;
  requiredRows?: number;
}
