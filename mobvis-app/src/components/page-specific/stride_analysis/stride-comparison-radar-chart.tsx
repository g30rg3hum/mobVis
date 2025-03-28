import { Button } from "@/components/shadcn-components/button";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/shadcn-components/select";
import RadarChart from "@/components/viz/charts&graphs/radar-chart";
import { perStrideParamFields } from "@/lib/fields";
import { colours, groupPerStrideParametersByWbId } from "@/lib/utils";
import { PerStrideParameters, Record } from "@/types/parameters";
import { faCircle, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "@radix-ui/react-label";
import { Select, SelectValue } from "@radix-ui/react-select";
import { useState } from "react";

interface Props {
  allPerStrideParameters: PerStrideParameters;
  setModalMessage: (message: string) => void;
}
export default function StrideComparisonRadarChart({
  allPerStrideParameters,
  setModalMessage,
}: Props) {
  const groupedPerStrideParameters = groupPerStrideParametersByWbId(
    allPerStrideParameters
  );
  const allWbIds = Array.from(groupedPerStrideParameters.keys());

  // indices of strides.
  const [strides, setStrides] = useState<number[]>([0]);
  const [selectedWb, setSelectedWb] = useState<number | undefined>(undefined);
  const [selectedStride, setSelectedStride] = useState<number | undefined>(
    undefined
  );
  // states to properly reset the dropdown
  const [key1, setKey1] = useState(1);
  const [key2, setKey2] = useState(0);

  const validStrides = allPerStrideParameters
    // only strides that don't have an index in strides
    .filter((_, index) => !strides.includes(index))
    // only strides of the selected walking bout
    .filter((stride) => stride.wb_id === selectedWb);

  return (
    <>
      <div className="flex gap-4 items-end">
        <Select
          key={key1}
          onValueChange={(val: string) => {
            setSelectedWb(Number(val));
            setSelectedStride(undefined);
          }}
          defaultValue={selectedWb?.toString()}
        >
          <div className="flex flex-col gap-1">
            <Label>Walking bout</Label>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select a walking bout">
                {selectedWb !== undefined
                  ? selectedWb.toString()
                  : "Select a walking bout"}
              </SelectValue>
            </SelectTrigger>
          </div>
          <SelectContent>
            <SelectGroup>
              {allWbIds.map((id) => (
                <SelectItem value={id.toString()} key={id}>
                  {id}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(val: string) => setSelectedStride(Number(val))}
          defaultValue={selectedStride?.toString()}
          key={key2}
        >
          <div className="flex flex-col gap-1">
            <Label>Stride</Label>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select a corresponding stride">
                {selectedStride !== undefined
                  ? selectedStride.toString()
                  : "Select a corresponding stride"}
              </SelectValue>
            </SelectTrigger>
          </div>
          <SelectContent>
            <SelectGroup>
              {validStrides.map((stride) => (
                <SelectItem value={stride.s_id.toString()} key={stride.s_id}>
                  {stride.s_id}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          variant="default"
          type="button"
          onClick={() => {
            if (selectedStride === undefined || selectedWb === undefined) {
              setModalMessage("Please select a walking bout and stride.");
              return;
            }

            if (selectedStride !== undefined && selectedWb !== undefined) {
              if (strides.length >= 3) {
                setModalMessage("You can only compare up to 3 strides.");
                return;
              }

              const newStride = allPerStrideParameters.find(
                (stride) =>
                  stride.s_id === selectedStride && stride.wb_id === selectedWb
              );
              if (newStride !== undefined) {
                const index = allPerStrideParameters.indexOf(newStride);
                setStrides((prev) => [...prev, index]);
              } else {
                setModalMessage(
                  "Something wrong happened. Could not find the selected stride within the selected walking bout."
                );
              }

              setSelectedStride(undefined);
              setSelectedWb(undefined);
              setKey1((prev) => prev + 1);
              setKey2((prev) => prev + 1);
            }
          }}
          className="self-end"
        >
          Add
        </Button>
        <div>
          <ul className="flex gap-6">
            {strides.map((stride, i) => {
              const strideData = allPerStrideParameters[stride];

              return (
                <li
                  key={`${strideData.wb_id}:${strideData.s_id}`}
                  className="flex items-center gap-2"
                >
                  <p className="min-w-[20px]">
                    WB {strideData.wb_id}, Stride {strideData.s_id}
                  </p>
                  <FontAwesomeIcon icon={faCircle} color={colours[i]} />
                  <FontAwesomeIcon
                    icon={faX}
                    className="ml-1 cursor-pointer"
                    onClick={() =>
                      setStrides(strides.filter((s) => s !== stride))
                    }
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <RadarChart
        height={500}
        width={1000}
        radius={300}
        margin={{ left: 50, right: 50, bottom: 100, top: 100 }}
        data={allPerStrideParameters as unknown as Record[]}
        recordsToPlot={strides}
        axes={perStrideParamFields}
        className="self-center"
      />
    </>
  );
}
