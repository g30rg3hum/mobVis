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
import BarChart from "@/components/viz/charts&graphs/bar-chart";
import { perWbDataFields, refinedParamNames } from "@/lib/fields";
import {
  createDataset,
  filterOutZerosPerWbParameters,
  getWbProperty,
  sortWbsByProperty,
} from "@/lib/utils";
import { PerWbParameter, PerWbParameters } from "@/types/parameters";
import { useState } from "react";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function ParamProgressionBarChart({
  allPerWbParameters,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");
  const [ascDuration, setAscDuration] = useState<boolean>(false);

  const filteredAllPerWbParameters = filterOutZerosPerWbParameters(
    allPerWbParameters,
    focusParam as keyof PerWbParameter
  );

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
              {perWbDataFields.map((param) => (
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
            value={ascDuration.toString()}
            onChange={(el) => setAscDuration(el.target.checked)}
            className="w-4 h-4"
            id="v2AscDurationCheckbox"
          />
          <Label htmlFor="v2AscDurationCheckbox">
            Sort by ascending duration
          </Label>
        </div>
      </div>

      <BarChart
        height={520}
        width={500}
        margin={{ left: 70, right: 20, bottom: 50, top: 10 }}
        data={
          createDataset(
            getWbProperty(
              ascDuration
                ? sortWbsByProperty(filteredAllPerWbParameters, "duration_s")
                : filteredAllPerWbParameters,
              "wb_id"
            ),
            getWbProperty(
              ascDuration
                ? sortWbsByProperty(filteredAllPerWbParameters, "duration_s")
                : filteredAllPerWbParameters,
              focusParam as keyof PerWbParameter
            )
          ) as [string, number][]
        }
        additionalData={
          createDataset(
            getWbProperty(
              ascDuration
                ? sortWbsByProperty(filteredAllPerWbParameters, "duration_s")
                : filteredAllPerWbParameters,
              "wb_id"
            ),
            getWbProperty(
              ascDuration
                ? sortWbsByProperty(filteredAllPerWbParameters, "duration_s")
                : filteredAllPerWbParameters,
              "duration_s"
            )
          ) as [string, number][]
        }
        xLabel="Walking bout ID"
        yLabel={refinedParamNames.get(focusParam) as string}
        className="self-center"
      />
    </>
  );
}
