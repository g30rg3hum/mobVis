"use client";

import BarChart from "@/components/viz/charts&graphs/bar-chart";
import { perWbParamFields, refinedParamNames } from "@/lib/fields";
import {
  createDataset,
  filterOutZerosPerWbParameters,
  getWbProperty,
} from "@/lib/utils";
import { PerWbParameter, PerWbParameters } from "@/types/parameters";
import { useState } from "react";
import SelectFocusParam from "../shared/select-focus-param";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function ParamProgressionBarChart({
  allPerWbParameters,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");

  const filteredAllPerWbParameters = filterOutZerosPerWbParameters(
    allPerWbParameters,
    focusParam as keyof PerWbParameter
  );

  return (
    <>
      <div className="flex gap-5 items-center">
        <SelectFocusParam
          setFocusParam={setFocusParam}
          focusParam={focusParam}
          paramFields={perWbParamFields}
        />
      </div>

      <BarChart
        height={650}
        width={1150}
        margin={{ left: 70, right: 20, bottom: 70, top: 10 }}
        data={
          createDataset(
            getWbProperty(filteredAllPerWbParameters, "wb_id"),
            getWbProperty(
              filteredAllPerWbParameters,
              focusParam as keyof PerWbParameter
            )
          ) as [string, number][]
        }
        xLabel="Walking bout ID"
        yLabel={refinedParamNames.get(focusParam) as string}
        className="self-center"
        tiltXLabels
      />
    </>
  );
}
