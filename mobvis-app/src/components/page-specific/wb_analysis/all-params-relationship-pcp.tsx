import ParallelCoordinatesPlot from "@/components/viz/charts&graphs/parallel-coordinates-plot";
import { perWbParamFields, refinedParamNames } from "@/lib/fields";
import { filterOutAllZerosPerWbParameters } from "@/lib/utils";
import { PerWbParameters } from "@/types/parameters";
import { useState } from "react";
import ShiftAxis from "../shared/shift-axis";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function AllParamsRelationshipPcp({
  allPerWbParameters,
}: Props) {
  const [currentAxes, setCurrentAxes] = useState<string[]>(perWbParamFields);

  const filteredAllPerWbParameters =
    filterOutAllZerosPerWbParameters(allPerWbParameters);

  return (
    <>
      <div className="flex gap-5 items-center">
        <ShiftAxis
          dataFields={perWbParamFields}
          refinedParamFieldNames={refinedParamNames}
          currentAxes={currentAxes}
          setCurrentAxes={setCurrentAxes}
        />
      </div>
      <ParallelCoordinatesPlot
        height={400}
        width={1100}
        margin={{ left: 120, right: 100, bottom: 50, top: 20 }}
        data={[filteredAllPerWbParameters]}
        axes={currentAxes}
        className="self-center"
        axesLabelMap={refinedParamNames}
        identifyingFields={["wb_id"]}
      />
    </>
  );
}
