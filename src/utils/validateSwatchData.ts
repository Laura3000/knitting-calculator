// This function returns a list of error messages.
// An empty array means "no errors" — the data is valid.
export function validateSwatchData(data: {
  swatchStitches: number;
  swatchWidthCm: number;
  desiredWidthCm: number;
  swatchRows?: number;
  swatchHeightCm?: number;
  desiredHeightCm?: number;
}): string[] {
  const errors: string[] = [];

  if (!data.swatchStitches || data.swatchStitches <= 0) {
    errors.push("Enter how many stitches you knitted in the swatch.");
  }

  if (!data.swatchWidthCm || data.swatchWidthCm <= 0) {
    errors.push("Enter the swatch width (greater than zero).");
  }

  if (!data.desiredWidthCm || data.desiredWidthCm <= 0) {
    errors.push("Enter the desired width (greater than zero).");
  }

  // Height fields are optional as a group, but if the user starts filling
  // one of them, we require all three for the calculation to make sense.
  const heightFields = [
    data.swatchRows,
    data.swatchHeightCm,
    data.desiredHeightCm,
  ];
  const filledHeightFields = heightFields.filter(
    (field) => field !== undefined,
  );

  if (filledHeightFields.length > 0 && filledHeightFields.length < 3) {
    errors.push("To calculate height, fill in all three rows/height fields.");
  }

  return errors;
}
