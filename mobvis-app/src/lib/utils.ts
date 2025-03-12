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
  ["no_strides", "Number of strides"],
  ["duration_s", "Duration (s)"],
  ["cadence_spm", "Cadence (steps per minute)"],
  ["stride_length_m", "Stride length (m)"],
  ["walking_speed_mps", "Walking speed (m/s)"],
]);

export function roundToNDpIfNeeded(num: number, n: number) {
  const roundTo5Dp = num.toFixed(n);

  // remove the trailing zeros
  return Number(roundTo5Dp);
}
