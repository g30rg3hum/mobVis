"use client";
import HyperLink from "@/components/custom/hyperlink";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/shadcn-components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/table";
import ScatterPlot from "@/components/viz/charts&graphs/scatter-plot";
import VizCardDescription from "@/components/viz/viz-card-description";
import VizCardTitle from "@/components/viz/viz-card-title";
import {
  createDataSet,
  getAndParseStorageItem,
  roundToNDpIfNeeded,
} from "@/lib/utils";
import { Inputs, PerWbParameter, PerWbParameters } from "@/types/parameters";
import { useEffect, useState } from "react";

export default function WbAnalysis() {
  const [inputs, setInputs] = useState<Inputs | null>(null);
  const [perWbParameters, setPerWbParameters] =
    useState<PerWbParameters | null>(null);

  useEffect(() => {
    setInputs(getAndParseStorageItem("inputs"));
    setPerWbParameters(getAndParseStorageItem("per_wb_parameters"));
  }, []);

  if (inputs && perWbParameters) {
    return (
      <div>
        <div className="p-10 text-white">
          <h1 className="text-4xl font-bold mb-2">
            🚶 Walking bout level analysis
          </h1>
          <p>
            Visualisations for per walking bout gait parameters extracted from{" "}
            <span className="font-semibold">{inputs.name}</span>.{" "}
            <HyperLink url="">Click here</HyperLink> to see the inputs
            you&apos;ve submitted.
          </p>
        </div>
        <div className="flex justify-center mb-10">
          <div className="flex flex-col gap-5 w-[850px]">
            <Card>
              <CardHeader>
                <VizCardTitle>
                  Table of all parameters of each walking bout
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "Tabular view of the exact figures of each gait parameter for each identified walking bout"
                  }
                  exampleAnalysis="what is the precise walking speed that the patient was walking at in the initial walking bout?"
                />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>WB ID</TableHead>
                      <TableHead>Number of strides</TableHead>
                      <TableHead>WB Duration (s)</TableHead>
                      <TableHead>Stride duration (s)</TableHead>
                      <TableHead>Cadence</TableHead>
                      <TableHead>Stride length</TableHead>
                      <TableHead>Walking speed (m/s)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perWbParameters.map((param: PerWbParameter) => (
                      <TableRow key={param.wb_id}>
                        <TableCell>{param.wb_id}</TableCell>
                        <TableCell>
                          {roundToNDpIfNeeded(param.n_strides, 5)}
                        </TableCell>
                        <TableCell>
                          {roundToNDpIfNeeded(param.duration_s, 5)}
                        </TableCell>
                        <TableCell>
                          {roundToNDpIfNeeded(param.stride_duration_s, 5)}
                        </TableCell>
                        <TableCell>
                          {roundToNDpIfNeeded(param.cadence_spm, 5)}
                        </TableCell>
                        <TableCell>
                          {roundToNDpIfNeeded(param.stride_length_m, 5)}
                        </TableCell>
                        <TableCell>
                          {roundToNDpIfNeeded(param.walking_speed_mps, 5)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <VizCardTitle>
                  Progression of a gait parameter (overtime /ascending duration)
                  (scatter plot)
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "Scatter plot of a focus gait parameter against walking bouts. The walking bouts can be ordered chronologically to look for any temporal relationships or in order of ascending duration to see if increasing duration has any effect on the gait parameter’s values."
                  }
                  exampleAnalysis="do later walking bouts involve slower gait speeds?"
                />
              </CardHeader>
              <CardContent className="flex justify-center">
                <ScatterPlot
                  height={500}
                  width={500}
                  margin={{ left: 100, right: 10, bottom: 50, top: 10 }}
                  data={createDataSet(
                    perWbParameters.map((wb) => wb.wb_id),
                    perWbParameters.map((wb) => wb.walking_speed_mps)
                  )}
                  xLabel="Walking bout ID"
                  yLabel="Gait parameter"
                  type="step"
                  integralX={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } else {
    // TODO: render not found form if no inputs submitted.
    return "Loading...";
  }
}
