import ParallelCoordinatesPlot from "@/components/viz/charts&graphs/parallel-coordinates-plot";
import AddWbDropdown from "../shared/add-wb-dropdown";
import { PerStrideParameters } from "@/types/parameters";
import { useState } from "react";
import {
  createPerStrideDatasetWithDesiredWbIds,
  filterOutAllZerosPerStrideParameters,
  groupPerStrideParametersByWbId,
} from "@/lib/utils";
import SelectedWbsList from "../shared/selected-wbs-list";
import { perStrideParamFields, refinedParamNames } from "@/lib/fields";
import { Record } from "@/types/parameters";
import SettingCheckbox from "../shared/setting-checkbox";
import ShiftAxis from "../shared/shift-axis";

interface Props {
  allPerStrideParameters: PerStrideParameters;
  setModalMessage: (message: string) => void;
}
export default function RelationshipBetweenAllGaitParametersPcp({
  allPerStrideParameters,
  setModalMessage,
}: Props) {
  const [currentAxes, setCurrentAxes] =
    useState<string[]>(perStrideParamFields);
  const [currentWbIds, setCurrentWbIds] = useState<number[]>([0]);
  const [splitLR, setSplitLR] = useState(false);

  const filteredPerStrideParameters = filterOutAllZerosPerStrideParameters(
    allPerStrideParameters
  );

  const groupedPerStrideParameters = groupPerStrideParametersByWbId(
    filteredPerStrideParameters
  );
  const allWbIds = Array.from(groupedPerStrideParameters.keys());

  return (
    <>
      <div className="flex items-end gap-5">
        <AddWbDropdown
          currentWbIds={currentWbIds}
          allWbIds={allWbIds}
          maxWbs={3}
          setCurrentWbIds={setCurrentWbIds}
          maxHit={() => {
            setModalMessage("You can only plot up to 3 walking bouts.");
          }}
          disabled={splitLR}
        />

        <SelectedWbsList
          wbs={currentWbIds}
          setWbs={setCurrentWbIds}
          horizontal
          splitLR={splitLR}
        />

        <SettingCheckbox
          state={splitLR}
          setState={setSplitLR}
          inputId="pcpSplitLRCheckbox"
          label="Split L and R strides?"
          disabled={currentWbIds.length !== 1}
        />
      </div>
      <div className="flex items-end gap-5">
        <ShiftAxis
          dataFields={perStrideParamFields}
          refinedParamFieldNames={refinedParamNames}
          currentAxes={currentAxes}
          setCurrentAxes={setCurrentAxes}
        />
      </div>

      <ParallelCoordinatesPlot
        height={400}
        width={1000}
        margin={{ left: 60, right: 60, bottom: 50, top: 50 }}
        data={
          createPerStrideDatasetWithDesiredWbIds(
            currentWbIds,
            groupedPerStrideParameters,
            splitLR
          ) as unknown as Record[][]
        }
        axes={currentAxes}
        className="self-center"
        axesLabelMap={refinedParamNames}
        identifyingFields={["wb_id", "s_id"]}
      />
    </>
  );
}
