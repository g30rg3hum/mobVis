import { Button } from "@/components/shadcn-components/button";
import { Label } from "@/components/shadcn-components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/select";
import ParallelCoordinatesPlot from "@/components/viz/charts&graphs/parallel-coordinates-plot";
import { perWbDataFields, refinedParamNames } from "@/lib/fields";
import { filterOutAllZerosPerWbParameters } from "@/lib/utils";
import { PerWbParameters } from "@/types/parameters";
import { useState } from "react";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function AllParamsRelationshipPcp({
  allPerWbParameters,
}: Props) {
  const [shiftParam, setShiftParam] = useState<string>("walking_speed_mps");
  const [newPosition, setNewPosition] = useState<number>(0);
  const [currentAxes, setCurrentAxes] = useState<string[]>(
    perWbDataFields.filter((param) => param !== "wb_id")
  );

  const filteredAllPerWbParameters =
    filterOutAllZerosPerWbParameters(allPerWbParameters);

  return (
    <>
      <div className="flex gap-5 items-center">
        <div className="flex gap-2">
          <Select onValueChange={setShiftParam} defaultValue={shiftParam}>
            <div className="flex flex-col gap-1">
              <Label>Axis to shift</Label>
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
          <Select
            onValueChange={(val) => setNewPosition(Number(val))}
            defaultValue={newPosition.toString()}
          >
            <div className="flex flex-col gap-1">
              <Label>New position</Label>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select position to shift to" />
              </SelectTrigger>
            </div>
            <SelectContent>
              <SelectGroup>
                {perWbDataFields
                  .filter((param) => param !== "wb_id")
                  .map((_, i) => (
                    <SelectItem value={i.toString()} key={i}>
                      {i + 1}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="default"
            type="button"
            onClick={() => {
              // swap the axes.
              const newAxes = [...currentAxes];
              const oldPosition = currentAxes.indexOf(shiftParam);
              const paramAtNewPosition = newAxes[newPosition];
              newAxes[oldPosition] = paramAtNewPosition;
              newAxes[newPosition] = shiftParam;
              setCurrentAxes(newAxes);
            }}
            className="self-end"
          >
            Shift
          </Button>
        </div>
      </div>
      <ParallelCoordinatesPlot
        height={400}
        width={1000}
        margin={{ left: 100, right: 100, bottom: 50, top: 20 }}
        data={[filteredAllPerWbParameters]}
        axes={currentAxes}
        className="self-center"
        axesLabelMap={refinedParamNames}
        identifyingField="wb_id"
      />
    </>
  );
}
