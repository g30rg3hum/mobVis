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
import { refinedParamNames } from "@/lib/fields";
import { useState } from "react";

interface Props {
  dataFields: string[];
  currentAxes: string[];
  setCurrentAxes: (axes: string[]) => void;
}
export default function SwapAxes({
  dataFields,
  currentAxes,
  setCurrentAxes,
}: Props) {
  const [parameterOneSwap, setParameterOneSwap] =
    useState<string>("walking_speed_mps");
  const [parameterTwoSwap, setParameterTwoSwap] =
    useState<string>("stride_length_m");

  return (
    <div className="flex gap-3">
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
            {dataFields
              .filter((param) => param !== parameterTwoSwap)
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
            {dataFields
              .filter((param) => param !== parameterOneSwap)
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
  );
}
{
  /* <div className="flex gap-2">
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
        </div> */
}
