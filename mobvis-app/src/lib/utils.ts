import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mandatoryErrorMsg = "Please fill in this field";

export function getAndParseStorageItem(item: string) {
  return JSON.parse(localStorage.getItem(item) ?? "");
}

export function convertHoursToMinutesAndTrunc(hours: number) {
  return Math.trunc(hours * 60);
}

export const refinedParamNames = new Map([
  ["n_strides", "Number of strides"],
  ["duration_s", "Duration (s)"],
  ["cadence_spm", "Cadence (steps per minute)"],
  ["stride_length_m", "Stride length (m)"],
  ["walking_speed_mps", "Walking speed (m/s)"],
  ["stride_duration_s", "Stride duration (s)"],
]);

export function roundToNDpIfNeeded(num: number, n: number) {
  const roundTo5Dp = num.toFixed(n);

  // remove the trailing zeros
  return Number(roundTo5Dp);
}

export function createDataSet(
  xValues: number[],
  yValues: number[]
): [number, number][] {
  const dataset: [number, number][] = [];
  if (xValues.length !== yValues.length) {
    throw new Error("xValues and yValues should be the same length");
  }

  for (let i = 0; i < xValues.length; i++) {
    dataset.push([xValues[i], yValues[i]]);
  }
  return dataset;
}
