import {
  createDatasetOfKeyAndValTuples,
  filterOutZerosPerStrideParameters,
  groupPerStrideParametersByWbId,
} from "@/lib/utils";
import { PerStrideParameter, PerStrideParameters } from "@/types/parameters";
import { useState } from "react";
import SelectFocusParam from "../shared/select-focus-param";
import AddWbDropdown from "../shared/add-wb-dropdown";
import SelectedWbsList from "../shared/selected-wbs-list";
import { perStrideParamFields, refinedParamNames } from "@/lib/fields";
import ViolinBoxPlot from "@/components/viz/charts&graphs/violin-plot";
import SettingCheckbox from "../shared/setting-checkbox";
import BinSlider from "../shared/bin-slider";

interface Props {
  allPerStrideParameters: PerStrideParameters;
  setModalMessage: (message: string) => void;
}
export default function StrideParamDistributionViolinPlot({
  allPerStrideParameters,
  setModalMessage,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");
  const [currentWbIds, setCurrentWbIds] = useState<number[]>([0]);
  const [box, setBox] = useState(false);
  const [binSize, setBinSize] = useState<number>(20);

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
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-5 ">
          <AddWbDropdown
            currentWbIds={currentWbIds}
            allWbIds={allWbIds}
            maxWbs={5}
            setCurrentWbIds={setCurrentWbIds}
            maxHit={() =>
              setModalMessage("You can only plot up to 5 walking bouts.")
            }
          />

          <SelectFocusParam
            setFocusParam={setFocusParam}
            focusParam={focusParam}
            paramFields={perStrideParamFields}
          />

          <SettingCheckbox
            state={box}
            setState={setBox}
            inputId="violinBoxCheckbox"
            label="Box?"
          />

          <SelectedWbsList
            wbs={currentWbIds}
            setWbs={setCurrentWbIds}
            horizontal
          />
        </div>
        <div className="w-1/2">
          <BinSlider
            binSize={binSize}
            setBinSize={setBinSize}
            max={50}
            min={10}
            step={5}
          />
        </div>
      </div>

      <ViolinBoxPlot
        className="self-center"
        width={1150}
        height={500}
        margin={{ left: 80, right: 30, top: 30, bottom: 70 }}
        xLabel="WB ID"
        yLabel={refinedParamNames.get(focusParam)!}
        data={createDatasetOfKeyAndValTuples(
          currentWbIds,
          focusParam as keyof PerStrideParameter,
          groupedPerStrideParameters
        )}
        box={box}
        binSize={binSize}
      />
    </>
  );
}
