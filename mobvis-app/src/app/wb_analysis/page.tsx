"use client";
import HyperLink from "@/components/custom/hyperlink";
import InputsDialog from "@/components/page-specific/inputs/inputs-dialog";
import TableOfPerWbParameters from "@/components/page-specific/wb_analysis/table-of-per-wb-parameters";
import { Button } from "@/components/shadcn-components/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/shadcn-components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-components/dialog";
import { Label } from "@/components/shadcn-components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-components/select";

import BarChart from "@/components/viz/charts&graphs/bar-chart";
import ParallelCoordinatesPlot from "@/components/viz/charts&graphs/parallel-coordinates-plot";
import RadarChart, {
  colours,
} from "@/components/viz/charts&graphs/radar-chart";
import ScatterPlot from "@/components/viz/charts&graphs/scatter-plot";
import VizCardDescription from "@/components/viz/viz-card-description";
import VizCardTitle from "@/components/viz/viz-card-title";
import { perWbDataFields, refinedParamNames } from "@/lib/fields";
import {
  createDataset,
  getAndParseStorageItem,
  getWbProperty,
  sortWbsByProperty,
} from "@/lib/utils";
import {
  InputsJson,
  PerWbParameter,
  PerWbParameters,
} from "@/types/parameters";
import { faStar, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function WbAnalysis() {
  // retrieving and getting data to visualise
  const [inputs, setInputs] = useState<InputsJson | null>(null);
  const [perWbParameters, setPerWbParameters] =
    useState<PerWbParameters | null>(null);
  useEffect(() => {
    setInputs(getAndParseStorageItem("inputs"));
    setPerWbParameters(getAndParseStorageItem("per_wb_parameters"));
  }, []);

  // inputs dialog state.
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);

  // STATES FOR TABLE AND VISUALISATIONS
  // -------------------------------------

  const [v1FocusParam, setV1FocusParam] = useState<string>("walking_speed_mps");
  const [v1Step, setV1Step] = useState<boolean>(false);

  const [v2FocusParam, setV2FocusParam] = useState<string>("walking_speed_mps");
  const [ascDuration, setAscDuration] = useState<boolean>(false);

  const [v3ParamX, setV3ParamX] = useState<string>("stride_length_m");
  const [v3ParamY, setV3ParamY] = useState<string>("walking_speed_mps");

  const [v5Wbs, setV5Wbs] = useState<number[]>([0]);
  const [v5SelectedWb, setV5SelectedWb] = useState<number | undefined>(
    undefined
  );

  const [modalMessage, setModalMessage] = useState<string | undefined>(
    undefined
  );

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
            <HyperLink url="" onClick={() => setIsInputDialogOpen(true)}>
              Click here
            </HyperLink>{" "}
            to see the inputs you&apos;ve submitted.
          </p>
          <InputsDialog
            inputs={inputs}
            isInputDialogOpen={isInputDialogOpen}
            setIsInputDialogOpen={setIsInputDialogOpen}
          />
        </div>
        <div className="flex justify-center mb-10">
          <div className="flex flex-col gap-5 w-[1300px]">
            <Card>
              <CardHeader>
                <VizCardTitle>
                  Table of all gait parameters under each walking bout
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "Tabular view of the exact figures of each gait parameter for each identified walking bout in the CSV data you uploaded. Use this table to assist your decision in picking what walking bouts to visualise for, in the visualisations below. There is also a field in which you can set the number to group the records into."
                  }
                  exampleAnalysis="what is the precise walking speed that the patient was walking at in the initial walking bout?"
                />
              </CardHeader>
              <CardContent className="space-y-5">
                <TableOfPerWbParameters allPerWbParameters={perWbParameters} />
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
                      "Plot of a focus gait parameter against walking bouts. The walking bouts are ordered chronologically to look for any temporal relationships. More specfiically, how does the focus gait parameter evolve over time? The plot can be displayed as a connected scatter plot or step plot using the checkbox."
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
                          {perWbDataFields
                            .filter((param) => param !== "wb_id")
                            .map((param) => (
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
                      "Similar to the scatter plot on the left except represented in bar chart form. The fuller 'bar' form may offer a clearer and more straight-forward representation and comparison of value. There is also an additional checkbox setting to sort in increasing order of duration to see if there is a trend between WB duration and the focus parameter."
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
                  Relationship between all gait parameters
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "A parallel coordinates plot with an axis for each gait parameter. Each walking bout is a data line through these axes. The patterns of how these data lines cross, converge and cluster through these axes may reveal relationships between the gait parameters."
                  }
                  exampleAnalysis="are the data lines between two axes mostly parallel, i.e. indicating a correlation between the gait parameters?"
                />
              </CardHeader>
              <CardContent className="flex flex-col justify-center gap-10">
                <ParallelCoordinatesPlot
                  height={400}
                  width={1000}
                  margin={{ left: 60, right: 60, bottom: 50, top: 50 }}
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  data={perWbParameters.map(({ wb_id, ...rest }) => rest)}
                  axes={perWbDataFields.filter((param) => param !== "wb_id")}
                  className="self-center"
                  axesLabelMap={refinedParamNames}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <VizCardTitle>
                  Relationship between two gait parameters
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "A regular scatter plot where you can select the gait parameters for the x and y axes respectively. This offers a more isolated and clearer view of correlation between two specific gait parameters. Hover over the trend line to also see the correlation coefficient."
                  }
                  exampleAnalysis="does longer stride length correlate to faster gait speeds?"
                />
              </CardHeader>
              <CardContent className="flex flex-col justify-center gap-10">
                <div className="flex gap-5 items-center">
                  <Select onValueChange={setV3ParamX} defaultValue={v3ParamX}>
                    <div className="flex flex-col gap-1">
                      <Label>X-axis parameter</Label>
                      <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select x-axis parameter" />
                      </SelectTrigger>
                    </div>
                    <SelectContent>
                      <SelectGroup>
                        {perWbDataFields
                          .filter((param) => param !== v3ParamY)
                          .map((param) => (
                            <SelectItem value={param} key={param}>
                              {refinedParamNames.get(param)}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setV3ParamY} defaultValue={v3ParamY}>
                    <div className="flex flex-col gap-1">
                      <Label>Y-axis parameter</Label>
                      <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select y-axis parameter" />
                      </SelectTrigger>
                    </div>
                    <SelectContent>
                      <SelectGroup>
                        {perWbDataFields
                          .filter((param) => param !== v3ParamX)
                          .map((param) => (
                            <SelectItem value={param} key={param}>
                              {refinedParamNames.get(param)}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <ScatterPlot
                  height={500}
                  width={1000}
                  margin={{ left: 100, right: 50, bottom: 65, top: 20 }}
                  data={
                    createDataset(
                      perWbParameters.map(
                        (wb) => wb[v3ParamX as keyof PerWbParameter]
                      ),
                      perWbParameters.map(
                        (wb) => wb[v3ParamY as keyof PerWbParameter]
                      )
                    ) as [number, number][]
                  }
                  xLabel={refinedParamNames.get(v3ParamX) as string}
                  yLabel={refinedParamNames.get(v3ParamY) as string}
                  type="correlation"
                  className="self-center"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <VizCardTitle>Comparison between walking bouts</VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "A radar chart with an axis for each gait parameter, plotting against identified walking bouts from this current gait analysis. Select walking bouts to plot by using the dropdown. Representing the walking bouts as shapes provide straightforward insights about how the walking bouts compare across each dimension (gait parameter). You can plot for up to three walking bouts, to avoid the chart getting too cluttered."
                  }
                  exampleAnalysis="for which parameters does a given walking bout have higher values for, compared against another walking bout?"
                />
              </CardHeader>
              <CardContent className="flex flex-col justify-center gap-10">
                <div className="space-y-2">
                  <div className="flex gap-3 items-center">
                    <Select
                      onValueChange={(val: string) =>
                        setV5SelectedWb(Number(val))
                      }
                      defaultValue={v5SelectedWb?.toString()}
                    >
                      <div className="flex flex-col gap-1">
                        <Label>Walking bout</Label>
                        <SelectTrigger className="w-[240px]">
                          <SelectValue placeholder="Select a walking bout to plot" />
                        </SelectTrigger>
                      </div>
                      <SelectContent>
                        <SelectGroup>
                          {perWbParameters
                            .map((param) => param.wb_id)
                            .filter((id) => !v5Wbs.includes(id))
                            .map((id) => (
                              <SelectItem value={id.toString()} key={id}>
                                {id}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="default"
                      type="button"
                      onClick={() => {
                        console.log(v5Wbs);
                        if (v5Wbs.length === 3) {
                          setModalMessage(
                            "You can only plot up to 3 walking bouts."
                          );
                          return;
                        }
                        if (v5SelectedWb !== undefined)
                          setV5Wbs((prev) => [...prev, v5SelectedWb]);
                      }}
                      className="self-end"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="absolute">
                    <ul>
                      {v5Wbs.map((wb, i) => (
                        <li key={wb} className="flex items-center gap-2">
                          <p>{wb}</p>
                          <FontAwesomeIcon icon={faStar} color={colours[i]} />
                          <FontAwesomeIcon
                            icon={faX}
                            className="ml-1 cursor-pointer"
                            onClick={() =>
                              setV5Wbs(v5Wbs.filter((id) => id !== wb))
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <RadarChart
                  height={500}
                  width={1000}
                  radius={300}
                  margin={{ left: 50, right: 50, bottom: 100, top: 100 }}
                  data={perWbParameters}
                  recordsToPlot={v5Wbs}
                  axes={perWbDataFields.filter((col) => col !== "wb_id")}
                  className="self-center"
                />
              </CardContent>
            </Card>
            <Dialog
              open={modalMessage !== undefined}
              onOpenChange={() => setModalMessage(undefined)}
            >
              <DialogContent data-testid="inputs-dialog">
                <DialogHeader>
                  <DialogTitle className="font-semibold">
                    Attention! 🚨
                  </DialogTitle>
                </DialogHeader>
                <p>{modalMessage}</p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    );
  } else {
    // TODO: render not found form if no inputs submitted.
    return "Loading...";
  }
}
