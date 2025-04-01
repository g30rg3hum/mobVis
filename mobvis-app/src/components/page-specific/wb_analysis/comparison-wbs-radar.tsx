import RadarChart from "@/components/viz/charts&graphs/radar-chart";
import { perWbParamFields, refinedParamNames } from "@/lib/fields";
import { PerWbParameters } from "@/types/parameters";
import { useState } from "react";
import AddWbDropdown from "../shared/add-wb-dropdown";
import SelectedWbsList from "../shared/selected-wbs-list";
import { filterOutAllZerosPerWbParameters } from "@/lib/utils";
import SwapAxes from "../shared/swap-axes";

interface Props {
  allPerWbParameters: PerWbParameters;
  setModalMessage: (message: string) => void;
}
export default function ComparisonWbsRadar({
  allPerWbParameters,
  setModalMessage,
}: Props) {
  const [wbs, setWbs] = useState<number[]>([0]);
  const [currentAxes, setCurrentAxes] = useState<string[]>(perWbParamFields);

  const filteredAllPerWbParameters =
    filterOutAllZerosPerWbParameters(allPerWbParameters);

  return (
    <>
      <div className="flex flex-col gap-5 justify-end">
        <div className="flex gap-5 items-end">
          <AddWbDropdown
            currentWbIds={wbs}
            allWbIds={filteredAllPerWbParameters.map((param) => param.wb_id)}
            maxWbs={3}
            maxHit={() =>
              setModalMessage("You can only plot up to 3 walking bouts.")
            }
            setCurrentWbIds={setWbs}
          />
          <SelectedWbsList wbs={wbs} setWbs={setWbs} horizontal />
        </div>
        <SwapAxes
          dataFields={perWbParamFields}
          currentAxes={currentAxes}
          setCurrentAxes={setCurrentAxes}
        />
      </div>

      <RadarChart
        height={500}
        width={1000}
        radius={300}
        margin={{ left: 50, right: 50, bottom: 100, top: 100 }}
        data={filteredAllPerWbParameters}
        recordsToPlot={wbs}
        axes={currentAxes}
        axesNameMapper={refinedParamNames}
        className="self-center"
      />
    </>
  );
}
