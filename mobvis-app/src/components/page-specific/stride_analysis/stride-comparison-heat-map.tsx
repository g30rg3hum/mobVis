import HeatMap from "@/components/viz/charts&graphs/heat-map";
import AddWbDropdown from "../shared/add-wb-dropdown";
import { useState } from "react";
import {
  createPerStrideDatasetForHeatmap,
  groupPerStrideParametersByWbId,
} from "@/lib/utils";
import { PerStrideParameter, PerStrideParameters } from "@/types/parameters";
import SelectFocusParam from "./select-focus-param";
import SelectedWbsList from "../shared/selected-wbs-list";

interface Props {
  allPerStrideParameters: PerStrideParameters;
  setModalMessage: (message: string) => void;
}
export default function StrideComparisonHeatMap({
  allPerStrideParameters,
  setModalMessage,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");
  const [currentWbIds, setCurrentWbIds] = useState<number[]>([0]);

  const groupedPerStrideParameters = groupPerStrideParametersByWbId(
    allPerStrideParameters
  );
  const allWbIds = Array.from(groupedPerStrideParameters.keys());

  return (
    <>
      <div className="flex items-end gap-5">
        <AddWbDropdown
          currentWbIds={currentWbIds}
          allWbIds={allWbIds}
          maxWbs={10}
          setCurrentWbIds={setCurrentWbIds}
          maxHit={() => {
            setModalMessage("You can only plot up to 10 walking bouts.");
          }}
        />

        <SelectFocusParam
          setFocusParam={setFocusParam}
          focusParam={focusParam}
        />

        <SelectedWbsList
          wbs={currentWbIds}
          setWbs={setCurrentWbIds}
          horizontal
          showColours={false}
        />
      </div>

      <HeatMap
        className="self-center border border-red-500"
        height={500}
        width={1000}
        margin={{ left: 95, right: 150, bottom: 100, top: 40 }}
        xLabel="Strides"
        yLabel="Walking Bouts"
        data={createPerStrideDatasetForHeatmap(
          groupedPerStrideParameters,
          currentWbIds,
          focusParam as keyof PerStrideParameter
        )}
      />
    </>
  );
}
