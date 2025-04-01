import RadarChart from "@/components/viz/charts&graphs/radar-chart";
import { perWbDataFields, refinedParamNames } from "@/lib/fields";
import { PerWbParameters } from "@/types/parameters";
import { useState } from "react";
import AddWbDropdown from "../shared/add-wb-dropdown";
import SelectedWbsList from "../shared/selected-wbs-list";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/select";
import { Label } from "@/components/shadcn-components/label";
import { Button } from "@/components/shadcn-components/button";
import { filterOutAllZerosPerWbParameters } from "@/lib/utils";

interface Props {
  allPerWbParameters: PerWbParameters;
  setModalMessage: (message: string) => void;
}
export default function ComparisonWbsRadar({
  allPerWbParameters,
  setModalMessage,
}: Props) {
  const [wbs, setWbs] = useState<number[]>([0]);
  const [parameterOneSwap, setParameterOneSwap] =
    useState<string>("walking_speed_mps");
  const [parameterTwoSwap, setParameterTwoSwap] =
    useState<string>("stride_length_m");
  const [currentAxes, setCurrentAxes] = useState<string[]>(
    perWbDataFields.filter((col) => col !== "wb_id")
  );

  const filteredAllPerWbParameters =
    filterOutAllZerosPerWbParameters(allPerWbParameters);

  return (
    <>
      <div className="flex gap-5 items-end">
        <div className="flex gap-2">
          <AddWbDropdown
            currentWbIds={wbs}
            allWbIds={filteredAllPerWbParameters.map((param) => param.wb_id)}
            maxWbs={3}
            maxHit={() =>
              setModalMessage("You can only plot up to 3 walking bouts.")
            }
            setCurrentWbIds={setWbs}
          />
          <SelectedWbsList wbs={wbs} setWbs={setWbs} />
        </div>
        <div className="flex gap-2">
          <Select
            onValueChange={setParameterOneSwap}
            defaultValue={parameterOneSwap}
          >
            <div className="flex flex-col gap-1">
              <Label>First swap parameter</Label>
              <SelectTrigger className="w-[15rem]">
                <SelectValue placeholder="Select first parameter to swap" />
              </SelectTrigger>
            </div>
            <SelectContent>
              <SelectGroup>
                {perWbDataFields
                  .filter(
                    (param) => param !== "wb_id" && param !== parameterTwoSwap
                  )
                  .map((param) => (
                    <SelectItem value={param} key={param}>
                      {refinedParamNames.get(param)}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={setParameterTwoSwap}
            defaultValue={parameterTwoSwap}
          >
            <div className="flex flex-col gap-1">
              <Label>Second swap parameter</Label>
              <SelectTrigger className="w-[15rem]">
                <SelectValue placeholder="Select second parameter to swap" />
              </SelectTrigger>
            </div>
            <SelectContent>
              <SelectGroup>
                {perWbDataFields
                  .filter(
                    (param) => param !== "wb_id" && param !== parameterOneSwap
                  )
                  .map((param) => (
                    <SelectItem value={param} key={param}>
                      {refinedParamNames.get(param)}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="default"
            type="button"
            onClick={() => {
              const newAxes = [...currentAxes];
              const firstPosition = currentAxes.indexOf(parameterOneSwap);
              const secondPosition = currentAxes.indexOf(parameterTwoSwap);
              const paramAtFirstPosition = newAxes[firstPosition];
              const paramAtSecondPosition = newAxes[secondPosition];
              newAxes[firstPosition] = paramAtSecondPosition;
              newAxes[secondPosition] = paramAtFirstPosition;
              setCurrentAxes(newAxes);
            }}
            className="self-end"
          >
            Swap
          </Button>
        </div>
      </div>

      <RadarChart
        height={500}
        width={1000}
        radius={300}
        margin={{ left: 50, right: 50, bottom: 100, top: 100 }}
        data={filteredAllPerWbParameters}
        recordsToPlot={wbs}
        axes={currentAxes}
        axesNameMapper={refinedParamNames}
        className="self-center"
      />
    </>
  );
}
