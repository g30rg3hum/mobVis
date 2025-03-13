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

export function roundToNDpIfNeeded(num: number, n: number) {
  const roundTo5Dp = num.toFixed(n);

  // remove the trailing zeros
  return Number(roundTo5Dp);
}

export function createDataset(
  xValues: number[] | string[],
  yValues: number[]
): [number | string, number][] {
  const dataset: [number | string, number][] = [];
  if (xValues.length !== yValues.length) {
    throw new Error("xValues and yValues should be the same length");
  }

  for (let i = 0; i < xValues.length; i++) {
    dataset.push([xValues[i], yValues[i]]);
  }
  return dataset;
}
