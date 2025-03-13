"use client";
import HyperLink from "@/components/custom/hyperlink";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/shadcn-components/card";
import { Label } from "@/components/shadcn-components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/select";
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
import { perWbDataFields, refinedParamNames } from "@/lib/fields";
import {
  createDataset,
  getAndParseStorageItem,
  roundToNDpIfNeeded,
} from "@/lib/utils";
import { Inputs, PerWbParameter, PerWbParameters } from "@/types/parameters";
import { useEffect, useState } from "react";

export default function WbAnalysis() {
  // data states
  const [inputs, setInputs] = useState<Inputs | null>(null);
  const [perWbParameters, setPerWbParameters] =
    useState<PerWbParameters | null>(null);

  // states for visualisations
  const [v1FocusParam, setV1FocusParam] = useState<string>("walking_speed_mps");
  const [v1Step, setV1Step] = useState<boolean>(false);

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
                      <TableHead>Cadence (steps/min)</TableHead>
                      <TableHead>Stride length (m)</TableHead>
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
                  Progression of a gait parameter overtime (scatter/step plot)
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "Plot of a focus gait parameter against walking bouts. The walking bouts are ordered chronologically to look for any temporal relationships. The plot can be displayed as a connected scatter plot or step plot using the checkbox."
                  }
                  exampleAnalysis="do later walking bouts involve slower gait speeds?"
                />
              </CardHeader>
              <CardContent className="flex flex-col justify-center gap-10">
                <div className="flex gap-5 items-center">
                  <Select
                    onValueChange={setV1FocusParam}
                    defaultValue={v1FocusParam}
                  >
                    <div className="flex flex-col gap-1">
                      <Label>Focus parameter</Label>
                      <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select focus parameter" />
                      </SelectTrigger>
                    </div>
                    <SelectContent>
                      <SelectGroup>
                        {perWbDataFields.map((param) => (
                          <SelectItem value={param} key={param}>
                            {refinedParamNames.get(param)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      value={v1Step.toString()}
                      onChange={(el) => setV1Step(el.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label>Step?</Label>
                  </div>
                </div>
                <ScatterPlot
                  height={500}
                  width={500}
                  margin={{ left: 100, right: 10, bottom: 50, top: 10 }}
                  data={createDataset(
                    perWbParameters.map((wb) => wb.wb_id),
                    perWbParameters.map(
                      (wb) => wb[v1FocusParam as keyof PerWbParameter]
                    )
                  )}
                  xLabel="Walking bout ID"
                  yLabel={refinedParamNames.get(v1FocusParam) as string}
                  type={v1Step ? "step" : "connected"}
                  integralX
                  className="self-center"
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
