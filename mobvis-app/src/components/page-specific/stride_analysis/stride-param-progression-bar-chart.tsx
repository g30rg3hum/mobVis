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
import { perStrideParamFields, refinedParamNames } from "@/lib/fields";
import {
  colours,
  createDataset,
  getStrideProperty,
  groupPerStrideParametersByWbId,
  splitPerStrideParametersIntoLAndR,
} from "@/lib/utils";
import { PerStrideParameter, PerStrideParameters } from "@/types/parameters";
import { useState } from "react";
import SwitchWb from "./switch-wb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

interface Props {
  allPerStrideParameters: PerStrideParameters;
}
export default function StrideParamProgressionBarChart({
  allPerStrideParameters,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");
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
              {perStrideParamFields.map((param) => (
                <SelectItem value={param} key={param}>
                  {refinedParamNames.get(param)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <ul>
          <li>
            <FontAwesomeIcon
              icon={faCircle}
              color={colours[0]}
              className="mr-2"
            />{" "}
            Left stride
          </li>
          <li>
            <FontAwesomeIcon
              icon={faCircle}
              color={colours[1]}
              className="mr-2"
            />{" "}
            Right Stride
          </li>
        </ul>
      </div>

      <BarChart
        height={600}
        width={500}
        margin={{ left: 60, right: 20, bottom: 50, top: 10 }}
        data={
          createDataset(
            getStrideProperty(currentPerStrideParameters, "s_id").map((id) =>
              id.toString()
            ),
            getStrideProperty(
              currentPerStrideParameters,
              focusParam as keyof PerStrideParameter
            ) as number[]
          ) as [string, number][]
        }
        xLabel="Stride ID"
        yLabel={refinedParamNames.get(focusParam) as string}
        className="self-center"
        differentColours={splitPerStrideParametersIntoLAndR(
          currentPerStrideParameters
        )}
      />
    </>
  );
}
