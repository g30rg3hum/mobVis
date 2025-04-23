"use client";

import ScatterPlot from "@/components/viz/charts&graphs/scatter-plot";
import { perWbParamFields, refinedParamNames } from "@/lib/fields";
import { createDataset, filterOutZerosPerWbParameters } from "@/lib/utils";
import { PerWbParameter, PerWbParameters } from "@/types/parameters";
import { useState } from "react";
import SettingCheckbox from "../shared/setting-checkbox";
import SelectFocusParam from "../shared/select-focus-param";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function ParamProgressionScatterPlot({
  allPerWbParameters,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");
  const [step, setStep] = useState<boolean>(false);

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
        <SettingCheckbox
          state={step}
          setState={setStep}
          inputId="v1StepCheckbox"
          label="Step?"
        />
      </div>
      <ScatterPlot
        height={500}
        width={1150}
        margin={{ left: 60, right: 20, bottom: 50, top: 10 }}
        data={
          createDataset(
            filteredAllPerWbParameters.map((wb) => wb.wb_id),
            filteredAllPerWbParameters.map(
              (wb) => wb[focusParam as keyof PerWbParameter]
            )
          ) as [number, number][]
        }
        xLabel="Walking bout ID"
        yLabel={refinedParamNames.get(focusParam) as string}
        type={step ? "step" : "connected"}
        className="self-center"
      />
    </>
  );
}
