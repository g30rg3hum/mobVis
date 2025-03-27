import { Button } from "@/components/shadcn-components/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/select";
import { Label } from "@radix-ui/react-label";
import { SetStateAction, useState } from "react";

interface Props {
  currentWbIds: number[];
  allWbIds: number[];
  maxWbs: number;
  maxHit?: () => void;
  setCurrentWbIds: (value: SetStateAction<number[]>) => void;
}
export default function AddWbDropdown({
  currentWbIds,
  allWbIds,
  maxWbs,
  maxHit,
  setCurrentWbIds,
}: Props) {
  const [selectedWb, setSelectedWb] = useState<number | undefined>(undefined);

  return (
    <div className="flex gap-3 items-center">
      <Select
        onValueChange={(val: string) => setSelectedWb(Number(val))}
        defaultValue={selectedWb?.toString()}
      >
        <div className="flex flex-col gap-1">
          <Label>Walking bout</Label>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select a walking bout to plot" />
          </SelectTrigger>
        </div>
        <SelectContent>
          <SelectGroup>
            {allWbIds
              .filter((id) => !currentWbIds.includes(id))
              .map((id) => (
                <SelectItem value={id.toString()} key={id}>
                  {id}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        variant="default"
        type="button"
        onClick={() => {
          if (selectedWb !== undefined) {
            if (currentWbIds.length === maxWbs && maxHit !== undefined) {
              maxHit();
              return;
            }
            setCurrentWbIds((prev) => [...prev, selectedWb]);
          }
        }}
        className="self-end"
      >
        Add
      </Button>
    </div>
  );
}
