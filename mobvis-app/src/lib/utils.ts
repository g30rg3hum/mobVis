import { HeatMapRecord } from "@/components/viz/charts&graphs/heat-map";
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

export function NAIfZeroElseRoundTo5Dp(num: number) {
  if (num === 0) {
    return "N/A";
  }
  return roundToNDpIfNeeded(num, 5);
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

export const colours = ["#9B29FF", "#08f0fc", "#ff243d", "#fff700", "#00ff26"];

export function splitPerStrideParametersIntoLAndRIndicesArray(
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

// THIS IS FOR DATA IN VIZ LIKE HISTOGRAM, VIOLIN PLOT
export function createDatasetOfKeyAndValTuples(
  currentWbIds: number[],
  focusParam: keyof PerStrideParameter,
  groupedPerStrideParameters: Map<number, PerStrideParameters>,
  leftAndRight: boolean = false
): [string, number][] {
  // include logic on splitting left and right strides if only 1 wbId
  if (currentWbIds.length !== 1 && leftAndRight) {
    throw new Error("Can only split left and right strides if only 1 wbId");
  }

  if (leftAndRight) {
    // create ["left"|"right", val][]
    const stridesForWbId = groupedPerStrideParameters.get(currentWbIds[0])!;
    return stridesForWbId.map((stride) => {
      const strideVal = stride[focusParam] as number;
      if (stride.lr_label === "left") return ["left", strideVal];
      else return ["right", strideVal];
    });
  }

  // regular implementation, no splitting into L and R.
  return currentWbIds.flatMap((wbId) => {
    const stridesForWbId = groupedPerStrideParameters.get(wbId)!;
    const allValuesForParam = getStrideProperty(
      stridesForWbId,
      // the focusParam is always a number parameter.
      focusParam as keyof PerStrideParameter
    ) as number[];

    // flattened so [wbId, val][]
    const result = allValuesForParam.map(
      (val) => [wbId.toString(), val] as [string, number]
    );

    return result;
  });
}

// THIS IS FOR DATA IN VIZ LIKE PCP
export function createPerStrideDatasetWithDesiredWbIds(
  currentWbIds: number[],
  groupedPerStrideParameters: Map<number, PerStrideParameters>,
  leftAndRight: boolean = false
): PerStrideParameters[] {
  if (currentWbIds.length !== 1 && leftAndRight) {
    throw new Error("Can only split left and right strides if only 1 wbId");
  }

  // split into left and right.
  if (leftAndRight) {
    const stridesForWbId = groupedPerStrideParameters.get(currentWbIds[0])!;
    const dividedStridesIndices =
      splitPerStrideParametersIntoLAndRIndicesArray(stridesForWbId);
    const leftStrides = dividedStridesIndices[0].map((i) => stridesForWbId[i]);
    const rightStrides = dividedStridesIndices[1].map((i) => stridesForWbId[i]);
    return [leftStrides, rightStrides];
  }

  // regular path:
  return currentWbIds.map((wbId) => {
    const stridesForWbId = groupedPerStrideParameters.get(wbId)!;
    return stridesForWbId;
  });
}

export function createPerStrideDatasetForHeatmap(
  groupedPerStrideParameters: Map<number, PerStrideParameters>,
  currentWbIds: number[],
  focusParam: keyof PerStrideParameter
): HeatMapRecord[] {
  const dataset: HeatMapRecord[] = [];

  const relevantWbs = currentWbIds.map(
    (wbId) => groupedPerStrideParameters.get(wbId)!
  );

  // get the max strides for a walking bout
  const allStridesLengths = Array.from(relevantWbs.values()).map(
    (val) => val.length
  );
  const maxStrides = Math.max(...allStridesLengths);
  // console.log(maxStrides);

  currentWbIds.forEach((wbId) => {
    // create the records for this wbId
    const stridesForWbId = groupedPerStrideParameters.get(wbId)!;

    stridesForWbId.forEach((stride, index) => {
      const paramValue = stride[focusParam] as number;
      const record: HeatMapRecord = {
        x: (index + 1).toString(),
        y: wbId.toString(),
        value: paramValue,
      };

      dataset.push(record);
    });

    // add the rest of the blank records.
    const numOfStrides = stridesForWbId.length;
    for (let i = numOfStrides; i < maxStrides; i++) {
      const record: HeatMapRecord = {
        x: (i + 1).toString(),
        y: wbId.toString(),
        value: 0,
      };
      dataset.push(record);
    }
  });

  // console.log(dataset);

  return dataset;
}

export function filterOutZerosPerStrideParameters(
  perStrideParameters: PerStrideParameters,
  focusParam: keyof PerStrideParameter
) {
  return perStrideParameters.filter(
    (perStrideParameter) =>
      perStrideParameter[focusParam as keyof PerStrideParameter] !== 0
  );
}

export function filterOutZerosPerWbParameters(
  perWbParameters: PerWbParameters,
  focusParam: keyof PerWbParameter
) {
  return perWbParameters.filter(
    (perWbParameter) => perWbParameter[focusParam as keyof PerWbParameter] !== 0
  );
}

export function filterOutAllZerosPerWbParameters(
  perWbParameters: PerWbParameters
) {
  return perWbParameters.filter(
    (wb) =>
      wb["n_strides"] !== 0 &&
      wb["duration_s"] !== 0 &&
      wb["stride_duration_s"] !== 0 &&
      wb["stride_length_m"] !== 0 &&
      wb["walking_speed_mps"] !== 0 &&
      wb["cadence_spm"] !== 0
  );
}

export function filterOutAllZerosPerStrideParameters(
  perStrideParameters: PerStrideParameters
) {
  return perStrideParameters.filter(
    (stride) =>
      stride["cadence_spm"] !== 0 &&
      stride["stride_duration_s"] !== 0 &&
      stride["stride_length_m"] !== 0 &&
      stride["walking_speed_mps"] !== 0
  );
}
