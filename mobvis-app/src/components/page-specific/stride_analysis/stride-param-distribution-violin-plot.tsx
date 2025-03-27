import ViolinPlot from "@/components/viz/charts&graphs/violin-plot";
import { getStrideProperty, groupPerStrideParametersByWbId } from "@/lib/utils";
import { PerStrideParameter, PerStrideParameters } from "@/types/parameters";
import { useState } from "react";
import SelectFocusParam from "./select-focus-param";
import AddWbDropdown from "../shared/add-wb-dropdown";
import SelectedWbsList from "../shared/selected-wbs-list";
import { refinedParamNames } from "@/lib/fields";

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

  const groupedPerStrideParameters = groupPerStrideParametersByWbId(
    allPerStrideParameters
  );
  const allWbIds = Array.from(groupedPerStrideParameters.keys());

  return (
    <>
      <div>
        <div className="flex flex-col gap-5">
          <AddWbDropdown
            currentWbIds={currentWbIds}
            allWbIds={allWbIds}
            maxWbs={3}
            setCurrentWbIds={setCurrentWbIds}
            maxHit={() =>
              setModalMessage("You can only plot up to 3 walking bouts.")
            }
          />

          <div className="flex gap-3 items-center">
            <SelectFocusParam
              setFocusParam={setFocusParam}
              focusParam={focusParam}
            />
            <SelectedWbsList
              wbs={currentWbIds}
              setWbs={setCurrentWbIds}
              horizontal
            />
          </div>
        </div>
      </div>

      <ViolinPlot
        className="self-center"
        width={450}
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
      />
    </>
  );
}
