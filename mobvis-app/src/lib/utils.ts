import {
  PerStrideParameter,
  PerStrideParameters,
  PerWbParameter,
  PerWbParameters,
} from "@/types/parameters";
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

export function divideThenRoundUpToInt(num: number, denom: number) {
  return Math.ceil(num / denom);
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

export function sortWbsByProperty(
  wbs: PerWbParameters,
  property: keyof PerWbParameter,
  asc: boolean = true // false if desc
) {
  let sorted;
  if (asc) {
    sorted = wbs.toSorted((wb1, wb2) => wb1[property] - wb2[property]);
  } else {
    sorted = wbs.toSorted((wb1, wb2) => wb2[property] - wb1[property]);
  }
  return sorted;
}

export function getWbProperty(
  wbs: PerWbParameters,
  property: keyof PerWbParameter
) {
  return wbs.map((wb) => wb[property]);
}

export function groupPerStrideParametersByWbId(
  perStrideParameters: PerStrideParameters
) {
  // create a map of wb_id to perStrideParameters
  const wbIdToPerStrideParameters = new Map<number, PerStrideParameters>();
  perStrideParameters.forEach((perStrideParameter) => {
    const wbId = perStrideParameter.wb_id;
    const currentArr = wbIdToPerStrideParameters.get(wbId);
    wbIdToPerStrideParameters.set(
      wbId,
      currentArr ? [...currentArr, perStrideParameter] : [perStrideParameter]
    );
  });
  return wbIdToPerStrideParameters;
}

export function sortStridesByProperty(
  strides: PerStrideParameters,
  property: keyof PerStrideParameter,
  asc: boolean = true
) {
  let sorted;
  if (asc) {
    if (property === "lr_label") {
      sorted = strides.toSorted((stride1, stride2) =>
        stride1[property].localeCompare(stride2[property])
      );
    } else {
      sorted = strides.toSorted(
        (stride1, stride2) => stride1[property] - stride2[property]
      );
    }
  } else {
    if (property === "lr_label") {
      sorted = strides.toSorted((stride1, stride2) =>
        stride2[property].localeCompare(stride1[property])
      );
    } else {
      sorted = strides.toSorted(
        (stride1, stride2) => stride2[property] - stride1[property]
      );
    }
  }
  return sorted;
}

export const colours = ["#9B29FF", "#08f0fc", "#ff243d"];

export function splitPerStrideParametersIntoLAndR(
  strides: PerStrideParameters
) {
  // left subarray, right subarray.
  const dividedStrides: [number[], number[]] = [[], []];
  strides.forEach((stride, i) => {
    if (stride.lr_label === "left") {
      dividedStrides[0].push(i);
    } else {
      dividedStrides[1].push(i);
    }
  });
  return dividedStrides;
}

export function getStrideProperty(
  strides: PerStrideParameters,
  property: keyof PerStrideParameter
) {
  return strides.map((stride) => stride[property]);
}
