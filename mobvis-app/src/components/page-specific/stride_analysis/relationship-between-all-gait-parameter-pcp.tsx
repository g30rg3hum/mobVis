import ParallelCoordinatesPlot from "@/components/viz/charts&graphs/parallel-coordinates-plot";
import AddWbDropdown from "../shared/add-wb-dropdown";
import { PerStrideParameters } from "@/types/parameters";
import { useState } from "react";
import {
  createPerStrideDatasetWithDesiredWbIds,
  groupPerStrideParametersByWbId,
} from "@/lib/utils";
import SelectedWbsList from "../shared/selected-wbs-list";
import { perStrideParamFields, refinedParamNames } from "@/lib/fields";
import { Record } from "@/types/parameters";
import SettingCheckbox from "../shared/setting-checkbox";

interface Props {
  allPerStrideParameters: PerStrideParameters;
  setModalMessage: (message: string) => void;
}
export default function RelationshipBetweenAllGaitParametersPcp({
  allPerStrideParameters,
  setModalMessage,
}: Props) {
  const [currentWbIds, setCurrentWbIds] = useState<number[]>([0]);
  const [splitLR, setSplitLR] = useState(false);

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
          maxWbs={3}
          setCurrentWbIds={setCurrentWbIds}
          maxHit={() => {
            setModalMessage("You can only plot up to 3 walking bouts.");
          }}
          disabled={splitLR}
        />

        <SettingCheckbox
          state={splitLR}
          setState={setSplitLR}
          inputId="pcpSplitLRCheckbox"
          label="Split L and R strides?"
          disabled={currentWbIds.length !== 1}
        />

        <SelectedWbsList
          wbs={currentWbIds}
          setWbs={setCurrentWbIds}
          horizontal
          splitLR={splitLR}
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
        axes={perStrideParamFields}
        className="self-center"
        axesLabelMap={refinedParamNames}
      />
    </>
  );
}
