import ViolinBoxPlot from "@/components/viz/charts&graphs/violin-plot";
import SelectFocusParam from "../stride_analysis/select-focus-param";
import { useState } from "react";
import { PerWbParameter, PerWbParameters } from "@/types/parameters";
import { refinedParamNames } from "@/lib/fields";
import SettingCheckbox from "../shared/setting-checkbox";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function ParameterDistributionViolinPlot({
  allPerWbParameters,
}: Props) {
  const [focusParam, setFocusParam] = useState<string>("walking_speed_mps");
  const [box, setBox] = useState(false);

  return (
    <>
      <div className="flex items-end gap-5">
        <SelectFocusParam
          setFocusParam={setFocusParam}
          focusParam={focusParam}
        />

        <SettingCheckbox
          state={box}
          setState={setBox}
          inputId="violinBoxCheckbox"
          label="Box?"
        />
      </div>
      <ViolinBoxPlot
        width={500}
        height={450}
        margin={{ top: 20, bottom: 65, left: 75, right: 25 }}
        xLabel=" Analysis"
        yLabel={refinedParamNames.get(focusParam)!}
        data={allPerWbParameters.map((wb) => [
          "Current analysis",
          wb[focusParam as keyof PerWbParameter] as number,
        ])}
        className="border border-red-500"
        box={box}
      />
    </>
  );
}
