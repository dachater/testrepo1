export interface SpecLimits {
  minValue: number | null;
  maxValue: number | null;
}

/** A value passes when it lies within the inclusive limits; a missing limit is unbounded. */
export function evaluateSpec(value: number, spec: SpecLimits): boolean {
  if (Number.isNaN(value)) return false;
  if (spec.minValue !== null && value < spec.minValue) return false;
  if (spec.maxValue !== null && value > spec.maxValue) return false;
  return true;
}
