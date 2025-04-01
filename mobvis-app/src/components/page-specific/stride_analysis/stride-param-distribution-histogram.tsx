import Histogram from "@/components/viz/charts&graphs/histogram";
import {
  createDatasetOfKeyAndValTuples,
  filterOutZerosPerStrideParameters,
  groupPerStrideParametersByWbId,
} from "@/lib/utils";
import { PerStrideParameter, PerStrideParameters } from "@/types/parameters";
import { useState } from "react";
import AddWbDropdown from "../shared/add-wb-dropdown";
import SelectFocusParam from "./select-focus-param";
import SelectedWbsList from "../shared/selected-wbs-list";
import { refinedParamNames } from "@/lib/fields";
import SettingCheckbox from "../shared/setting-checkbox";

interface Props {
  allPerStrideParameters: PerStrideParameters;
  setModalMessage: (message: string) => void;
}
export default function StrideParamDistributionHistogram({
  allPerStrideParameters,
  setModalMessage,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");
  const [currentWbIds, setCurrentWbIds] = useState<number[]>([0]);
  const [splitLR, setSplitLR] = useState(false);

  const filteredPerStrideParameters = filterOutZerosPerStrideParameters(
    allPerStrideParameters,
    focusParam as keyof PerStrideParameter
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

        <SelectFocusParam
          setFocusParam={setFocusParam}
          focusParam={focusParam}
        />

        <SettingCheckbox
          state={splitLR}
          setState={setSplitLR}
          inputId="histSplitLRCheckbox"
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

      <Histogram
        className="self-center"
        height={500}
        width={1050}
        margin={{ left: 70, right: 30, top: 30, bottom: 70 }}
        data={createDatasetOfKeyAndValTuples(
          currentWbIds,
          focusParam as keyof PerStrideParameter,
          groupedPerStrideParameters,
          splitLR
        )}
        xLabel={refinedParamNames.get(focusParam)!}
        yLabel="Frequency"
        sortBinnedData={splitLR}
      />
    </>
  );
}
