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
import RadarChart, {
  colours,
} from "@/components/viz/charts&graphs/radar-chart";
import { perWbDataFields } from "@/lib/fields";
import { PerWbParameters } from "@/types/parameters";
import { faStar, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface Props {
  allPerWbParameters: PerWbParameters;
  setModalMessage: (message: string) => void;
}
export default function ComparisonWbsRadar({
  allPerWbParameters,
  setModalMessage,
}: Props) {
  const [wbs, setWbs] = useState<number[]>([0]);
  const [selectedWb, setSelectedWb] = useState<number | undefined>(undefined);

  return (
    <>
      <div className="space-y-2">
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
                {allPerWbParameters
                  .map((param) => param.wb_id)
                  .filter((id) => !wbs.includes(id))
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
              if (wbs.length === 3) {
                setModalMessage("You can only plot up to 3 walking bouts.");
                return;
              }
              if (selectedWb !== undefined)
                setWbs((prev) => [...prev, selectedWb]);
            }}
            className="self-end"
          >
            Add
          </Button>
        </div>
        <div className="absolute">
          <ul>
            {wbs.map((wb, i) => (
              <li key={wb} className="flex items-center gap-2">
                <p>{wb}</p>
                <FontAwesomeIcon icon={faStar} color={colours[i]} />
                <FontAwesomeIcon
                  icon={faX}
                  className="ml-1 cursor-pointer"
                  onClick={() => setWbs(wbs.filter((id) => id !== wb))}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <RadarChart
        height={500}
        width={1000}
        radius={300}
        margin={{ left: 50, right: 50, bottom: 100, top: 100 }}
        data={allPerWbParameters}
        recordsToPlot={wbs}
        axes={perWbDataFields.filter((col) => col !== "wb_id")}
        className="self-center"
      />
    </>
  );
}
