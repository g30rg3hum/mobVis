import { getStrideProperty, groupPerStrideParametersByWbId } from "@/lib/utils";
import { PerStrideParameter, PerStrideParameters } from "@/types/parameters";
import { useState } from "react";
import SelectFocusParam from "./select-focus-param";
import AddWbDropdown from "../shared/add-wb-dropdown";
import SelectedWbsList from "../shared/selected-wbs-list";
import { refinedParamNames } from "@/lib/fields";
import ViolinBoxPlot from "@/components/viz/charts&graphs/violin-plot";
import SettingCheckbox from "../shared/setting-checkbox";

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

  const groupedPerStrideParameters = groupPerStrideParametersByWbId(
    allPerStrideParameters
  );
  const allWbIds = Array.from(groupedPerStrideParameters.keys());

  return (
    <>
      <div>
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
          />

          <SettingCheckbox
            state={box}
            setState={setBox}
            inputId="violinBoxCheckbox"
          />

          <SelectedWbsList
            wbs={currentWbIds}
            setWbs={setCurrentWbIds}
            horizontal
          />
        </div>
      </div>

      <ViolinBoxPlot
        className="self-center"
        width={1050}
        height={500}
        margin={{ left: 70, right: 30, top: 30, bottom: 70 }}
        xLabel="WB ID"
        yLabel={refinedParamNames.get(focusParam)!}
        data={currentWbIds.flatMap((wbId) => {
          const stridesForWbId = groupedPerStrideParameters.get(wbId)!;
          const allValuesForParam = getStrideProperty(
            stridesForWbId,
            // the focusParam is always a number parameter.
            focusParam as keyof PerStrideParameter
          ) as number[];

          // flattened so [wbId, val][]
          const result = allValuesForParam.map(
            (val) => [wbId.toString(), val] as [string, number]
          );

          return result;
        })}
        box={box}
      />
    </>
  );
}
