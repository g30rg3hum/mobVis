"use client";

import { Label } from "@/components/shadcn-components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/select";
import ScatterPlot from "@/components/viz/charts&graphs/scatter-plot";
import { perWbDataFields, refinedParamNames } from "@/lib/fields";
import { createDataset } from "@/lib/utils";
import { PerWbParameter, PerWbParameters } from "@/types/parameters";
import { useState } from "react";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function ParamProgressionScatterPlot({
  allPerWbParameters,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");
  const [step, setStep] = useState<boolean>(false);

  return (
    <>
      <div className="flex gap-5 items-center">
        <Select onValueChange={setFocusParam} defaultValue={focusParam}>
          <div className="flex flex-col gap-1">
            <Label>Focus parameter</Label>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select focus parameter" />
            </SelectTrigger>
          </div>
          <SelectContent>
            <SelectGroup>
              {perWbDataFields
                .filter((param) => param !== "wb_id")
                .map((param) => (
                  <SelectItem value={param} key={param}>
                    {refinedParamNames.get(param)}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-center justify-center gap-2 mt-4">
          <input
            type="checkbox"
            value={step.toString()}
            onChange={(el) => setStep(el.target.checked)}
            className="w-4 h-4"
            id="v1StepCheckbox"
          />
          <Label htmlFor="v1StepCheckbox">Step?</Label>
        </div>
      </div>
      <ScatterPlot
        height={500}
        width={500}
        margin={{ left: 60, right: 20, bottom: 50, top: 10 }}
        data={
          createDataset(
            allPerWbParameters.map((wb) => wb.wb_id),
            allPerWbParameters.map(
              (wb) => wb[focusParam as keyof PerWbParameter]
            )
          ) as [number, number][]
        }
        xLabel="Walking bout ID"
        yLabel={refinedParamNames.get(focusParam) as string}
        type={step ? "step" : "connected"}
        integralX
        className="self-center"
      />
    </>
  );
}
