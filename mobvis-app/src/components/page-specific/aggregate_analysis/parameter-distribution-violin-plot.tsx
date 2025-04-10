import ViolinBoxPlot from "@/components/viz/charts&graphs/violin-plot";
import SelectFocusParam from "../shared/select-focus-param";
import { useState } from "react";
import { PerWbParameter, PerWbParameters } from "@/types/parameters";
import { perWbParamFields, refinedParamNames } from "@/lib/fields";
import SettingCheckbox from "../shared/setting-checkbox";
import { filterOutZerosPerWbParameters } from "@/lib/utils";
import BinSlider from "../shared/bin-slider";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function ParameterDistributionViolinPlot({
  allPerWbParameters,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");
  const [box, setBox] = useState(false);
  const [binSize, setBinSize] = useState(20);

  const filteredAllPerWbParameters = filterOutZerosPerWbParameters(
    allPerWbParameters,
    focusParam as keyof PerWbParameter
  );

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <SelectFocusParam
            setFocusParam={setFocusParam}
            focusParam={focusParam}
            paramFields={perWbParamFields}
          />

          <SettingCheckbox
            state={box}
            setState={setBox}
            inputId="violinBoxCheckbox"
            label="Box?"
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

      <ViolinBoxPlot
        width={450}
        height={450}
        margin={{ top: 20, bottom: 65, left: 75, right: 25 }}
        xLabel=" Analysis"
        yLabel={refinedParamNames.get(focusParam)!}
        data={filteredAllPerWbParameters.map((wb) => [
          "Current analysis",
          wb[focusParam as keyof PerWbParameter] as number,
        ])}
        className="self-center"
        box={box}
        binSize={binSize}
      />
    </>
  );
}
