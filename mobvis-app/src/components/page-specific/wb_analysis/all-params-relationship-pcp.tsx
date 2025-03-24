import ParallelCoordinatesPlot from "@/components/viz/charts&graphs/parallel-coordinates-plot";
import { perWbDataFields, refinedParamNames } from "@/lib/fields";
import { PerWbParameters } from "@/types/parameters";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function AllParamsRelationshipPcp({
  allPerWbParameters,
}: Props) {
  return (
    <ParallelCoordinatesPlot
      height={400}
      width={1000}
      margin={{ left: 60, right: 60, bottom: 50, top: 50 }}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      data={allPerWbParameters.map(({ wb_id, ...rest }) => rest)}
      axes={perWbDataFields.filter((param) => param !== "wb_id")}
      className="self-center"
      axesLabelMap={refinedParamNames}
    />
  );
}
