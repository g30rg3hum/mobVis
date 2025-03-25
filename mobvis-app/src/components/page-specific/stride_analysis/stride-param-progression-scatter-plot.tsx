import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/select";
import ScatterPlot from "@/components/viz/charts&graphs/scatter-plot";
import { perStrideDataFields, refinedParamNames } from "@/lib/fields";
import { createDataset, groupPerStrideParametersByWbId } from "@/lib/utils";
import { PerStrideParameter, PerStrideParameters } from "@/types/parameters";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import SwitchWb from "./switch-wb";

interface Props {
  allPerStrideParameters: PerStrideParameters;
}
export default function StrideParamProgressionScatterPlot({
  allPerStrideParameters,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");
  const [step, setStep] = useState<boolean>(false);
  const [currentWbId, setCurrentWbId] = useState<number>(0);

  const groupedPerStrideParameters = groupPerStrideParametersByWbId(
    allPerStrideParameters
  );
  const wbCount = groupedPerStrideParameters.size;
  const currentPerStrideParameters =
    groupedPerStrideParameters.get(currentWbId)!;

  return (
    <>
      <div className="flex gap-5 items-center">
        <SwitchWb
          currentWbId={currentWbId}
          setCurrentWbId={setCurrentWbId}
          wbCount={wbCount}
        />

        <Select onValueChange={setFocusParam} defaultValue={focusParam}>
          <div className="flex flex-col gap-1">
            <Label>Focus parameter</Label>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select focus parameter" />
            </SelectTrigger>
          </div>
          <SelectContent>
            <SelectGroup>
              {perStrideDataFields
                .filter((param) => param !== "s_id" && param !== "lr_label")
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
            id="strideParamProgressionStepCheckbox"
          />
          <Label htmlFor="strideParamProgressionStepCheckbox">Step?</Label>
        </div>
      </div>

      <ScatterPlot
        height={500}
        width={500}
        margin={{ left: 60, right: 20, bottom: 50, top: 10 }}
        data={
          createDataset(
            currentPerStrideParameters.map((stride) => stride.s_id),
            currentPerStrideParameters.map(
              (stride) =>
                stride[
                  focusParam as Exclude<keyof PerStrideParameter, "lr_label">
                ]
            )
          ) as [number, number][]
        }
        xLabel="Stride ID"
        yLabel={refinedParamNames.get(focusParam) as string}
        type={step ? "step" : "connected"}
        integralX
        className="self-center"
      />
    </>
  );
}
