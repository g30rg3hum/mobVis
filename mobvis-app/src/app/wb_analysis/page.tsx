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
import BarChart from "@/components/viz/charts&graphs/bar-chart";
import ParallelCoordinatesPlot from "@/components/viz/charts&graphs/parallel-coordinates-plot";
import ScatterPlot from "@/components/viz/charts&graphs/scatter-plot";
import VizCardDescription from "@/components/viz/viz-card-description";
import VizCardTitle from "@/components/viz/viz-card-title";
import { perWbDataFields, refinedParamNames } from "@/lib/fields";
import {
  createDataset,
  getAndParseStorageItem,
  getWbProperty,
  roundToNDpIfNeeded,
  sortWbsByProperty,
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

  const [v2FocusParam, setV2FocusParam] = useState<string>("walking_speed_mps");
  const [ascDuration, setAscDuration] = useState<boolean>(false);

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
          <div className="flex flex-col gap-5 w-[1300px]">
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
            <div className="flex gap-5">
              <Card className="w-1/2">
                <CardHeader>
                  <VizCardTitle>
                    Progression of a gait parameter over time (scatter/step
                    plot)
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
                        id="v1StepCheckbox"
                      />
                      <Label htmlFor="v1StepCheckbox">Step?</Label>
                    </div>
                  </div>
                  <ScatterPlot
                    height={500}
                    width={500}
                    margin={{ left: 60, right: 20, bottom: 50, top: 10 }}
                    data={
                      createDataset(
                        perWbParameters.map((wb) => wb.wb_id),
                        perWbParameters.map(
                          (wb) => wb[v1FocusParam as keyof PerWbParameter]
                        )
                      ) as [number, number][]
                    }
                    xLabel="Walking bout ID"
                    yLabel={refinedParamNames.get(v1FocusParam) as string}
                    type={v1Step ? "step" : "connected"}
                    integralX
                    className="self-center"
                  />
                </CardContent>
              </Card>
              <Card className="w-1/2 flex flex-col justify-center">
                <CardHeader>
                  <VizCardTitle>
                    Progression of a gait parameter (over time/ascending
                    duration) (bar chart)
                  </VizCardTitle>
                  <VizCardDescription
                    mainDescription={
                      "Same as the scatter plot on the right except represented in bar chart form. The 'bar' form may offer a clearer and more straight-forward representation and comparison of value. There is also an additional checkbox to sort in increasing order of duration to see if there is a trend between WB duration and the focus parameter."
                    }
                    exampleAnalysis="do the bars of each chronological walking decrease steadily for gait speed and if so, by how much each time?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-10">
                  <div className="flex gap-5 items-center">
                    <Select
                      onValueChange={setV2FocusParam}
                      defaultValue={v2FocusParam}
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
                        value={ascDuration.toString()}
                        onChange={(el) => setAscDuration(el.target.checked)}
                        className="w-4 h-4"
                        id="v2AscDurationCheckbox"
                      />
                      <Label htmlFor="v2AscDurationCheckbox">
                        Sort by ascending duration
                      </Label>
                    </div>
                  </div>

                  <BarChart
                    height={400}
                    width={500}
                    margin={{ left: 60, right: 20, bottom: 50, top: 10 }}
                    data={
                      createDataset(
                        getWbProperty(
                          ascDuration
                            ? sortWbsByProperty(perWbParameters, "duration_s")
                            : perWbParameters,
                          "wb_id"
                        ),
                        getWbProperty(
                          ascDuration
                            ? sortWbsByProperty(perWbParameters, "duration_s")
                            : perWbParameters,
                          v2FocusParam as keyof PerWbParameter
                        )
                      ) as [string, number][]
                    }
                    xLabel="Walking bout ID"
                    yLabel={refinedParamNames.get(v2FocusParam) as string}
                    className="self-center"
                  />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <VizCardTitle>
                  Relatioship between all gait parameters
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "A parallel coordinates plot with an axis for each gait parameter. Each walking bout is a data line through these axes. The patterns of how these data lines cross and converge through these axes can reveal relationships between the gait parameters."
                  }
                  exampleAnalysis="are the data lines between two axes mostly parallel, i.e. indicating a positive correlation?"
                />
              </CardHeader>
              <CardContent className="flex flex-col justify-center gap-10">
                <ParallelCoordinatesPlot
                  height={400}
                  width={1000}
                  margin={{ left: 60, right: 60, bottom: 50, top: 50 }}
                  data={perWbParameters}
                  axes={perWbDataFields}
                  className="border border-red-500 self-center"
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
