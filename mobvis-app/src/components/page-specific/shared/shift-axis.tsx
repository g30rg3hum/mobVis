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
import { useState } from "react";

interface Props {
  dataFields: string[];
  refinedParamFieldNames: Map<string, string>;
  currentAxes: string[];
  setCurrentAxes: (axes: string[]) => void;
}
export default function ShiftAxis({
  dataFields,
  refinedParamFieldNames,
  currentAxes,
  setCurrentAxes,
}: Props) {
  const [shiftParam, setShiftParam] = useState<string>("walking_speed_mps");
  const [newPosition, setNewPosition] = useState<number>(0);

  return (
    <div className="flex gap-3">
      <Select onValueChange={setShiftParam} defaultValue={shiftParam}>
        <div className="flex flex-col gap-1">
          <Label>Axis to shift</Label>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select focus parameter" />
          </SelectTrigger>
        </div>
        <SelectContent>
          <SelectGroup>
            {dataFields.map((param) => (
              <SelectItem value={param} key={param}>
                {refinedParamFieldNames.get(param)}
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
            {dataFields.map((_, i) => (
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
  );
}
