import RadarChart from "@/components/viz/charts&graphs/radar-chart";
import { perWbDataFields } from "@/lib/fields";
import { PerWbParameters } from "@/types/parameters";
import { useState } from "react";
import AddWbDropdown from "../shared/add-wb-dropdown";
import SelectedWbsList from "../shared/selected-wbs-list";

interface Props {
  allPerWbParameters: PerWbParameters;
  setModalMessage: (message: string) => void;
}
export default function ComparisonWbsRadar({
  allPerWbParameters,
  setModalMessage,
}: Props) {
  const [wbs, setWbs] = useState<number[]>([0]);

  return (
    <>
      <div className="flex gap-5 items-end">
        <AddWbDropdown
          currentWbIds={wbs}
          allWbIds={allPerWbParameters.map((param) => param.wb_id)}
          maxWbs={3}
          maxHit={() =>
            setModalMessage("You can only plot up to 3 walking bouts.")
          }
          setCurrentWbIds={setWbs}
        />
        <SelectedWbsList wbs={wbs} setWbs={setWbs} />
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
