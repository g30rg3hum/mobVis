"use client";

import BarChart from "@/components/viz/charts&graphs/bar-chart";
import { refinedParamNames } from "@/lib/fields";
import {
  colours,
  createDataset,
  filterOutZerosPerStrideParameters,
  getStrideProperty,
  groupPerStrideParametersByWbId,
  splitPerStrideParametersIntoLAndRIndicesArray,
} from "@/lib/utils";
import { PerStrideParameter, PerStrideParameters } from "@/types/parameters";
import { useState } from "react";
import SwitchWb from "./switch-wb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import SelectFocusParam from "./select-focus-param";

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
  const currentPerStrideParameters = filterOutZerosPerStrideParameters(
    groupedPerStrideParameters.get(currentWbId)!,
    focusParam as keyof PerStrideParameter
  );

  return (
    <>
      <div className="flex gap-5 items-center">
        <SwitchWb
          currentWbId={currentWbId}
          setCurrentWbId={setCurrentWbId}
          wbCount={wbCount}
        />

        <SelectFocusParam
          setFocusParam={setFocusParam}
          focusParam={focusParam}
        />
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
        height={540}
        width={450}
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
        differentColours={splitPerStrideParametersIntoLAndRIndicesArray(
          currentPerStrideParameters
        )}
      />
    </>
  );
}
