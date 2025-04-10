import { PerWbParameter, PerWbParameters } from "@/types/parameters";
import { useState } from "react";
import SelectFocusParam from "../shared/select-focus-param";
import Histogram from "@/components/viz/charts&graphs/histogram";
import { perWbParamFields, refinedParamNames } from "@/lib/fields";
import { filterOutZerosPerWbParameters } from "@/lib/utils";
import BinSlider from "../shared/bin-slider";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function ParameterDistributionHistogram({
  allPerWbParameters,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");
  const [binSize, setBinSize] = useState(20);

  const filteredAllPerWbParameters = filterOutZerosPerWbParameters(
    allPerWbParameters,
    focusParam as keyof PerWbParameter
  );

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex items-end gap-5">
          <SelectFocusParam
            setFocusParam={setFocusParam}
            focusParam={focusParam}
            paramFields={perWbParamFields}
          />
        </div>
        <BinSlider
          binSize={binSize}
          setBinSize={setBinSize}
          max={50}
          min={10}
          step={5}
        />
      </div>

      <Histogram
        width={450}
        height={550}
        margin={{ top: 20, bottom: 65, left: 75, right: 25 }}
        data={filteredAllPerWbParameters.map((wb) => [
          "Current analysis",
          wb[focusParam as keyof PerWbParameter] as number,
        ])}
        className="self-center"
        xLabel={refinedParamNames.get(focusParam)!}
        yLabel="Frequency"
        binSize={binSize}
      />
    </>
  );
}
