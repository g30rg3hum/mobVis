import ScatterPlot from "@/components/viz/charts&graphs/scatter-plot";
import { refinedParamNames } from "@/lib/fields";
import {
  colours,
  createDataset,
  groupPerStrideParametersByWbId,
  splitPerStrideParametersIntoLAndRIndicesArray,
} from "@/lib/utils";
import { PerStrideParameter, PerStrideParameters } from "@/types/parameters";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import SwitchWb from "./switch-wb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import SelectFocusParam from "./select-focus-param";

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

        <SelectFocusParam
          setFocusParam={setFocusParam}
          focusParam={focusParam}
        />

        <div className="flex items-center justify-center gap-2 mt-5">
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

      <ScatterPlot
        height={500}
        width={450}
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
        differentColours={splitPerStrideParametersIntoLAndRIndicesArray(
          currentPerStrideParameters
        )}
      />
    </>
  );
}
