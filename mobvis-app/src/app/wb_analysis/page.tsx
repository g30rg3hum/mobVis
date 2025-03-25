"use client";
import HyperLink from "@/components/custom/hyperlink";
import InputsDialog from "@/components/page-specific/inputs/inputs-dialog";
import AllParamsRelationshipPcp from "@/components/page-specific/wb_analysis/all-params-relationship-pcp";
import ComparisonWbsRadar from "@/components/page-specific/wb_analysis/comparison-wbs-radar";
import ParamProgressionBarChart from "@/components/page-specific/wb_analysis/param-progression-bar-chart";
import ParamProgressionScatterPlot from "@/components/page-specific/wb_analysis/param-progression-scatter-plot";
import TableOfPerWbParameters from "@/components/page-specific/wb_analysis/table-of-per-wb-parameters";
import TwoParamsRelationshipScatter from "@/components/page-specific/wb_analysis/two-params-relationship-scatter";
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
import VizCardDescription from "@/components/viz/viz-card-description";
import VizCardTitle from "@/components/viz/viz-card-title";
import { getAndParseStorageItem } from "@/lib/utils";
import { InputsJson, PerWbParameters } from "@/types/parameters";
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
          <div className="flex flex-col gap-5 w-full max-w-[1300px] min-w-[1150px] mx-6">
            <Card>
              <CardHeader>
                <VizCardTitle>
                  Table of all gait parameters under each walking bout
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "Tabular view of the exact figures of each gait parameter for each identified walking bout in the CSV data you uploaded. Use this table to assist your decision in picking what walking bouts to visualise for, in the visualisations below. Drag rows around to compare certain records side by side. There is also a field in which you can set the number to group the records into. Please note that if a value is 0, it means that the value could not be calculated."
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
                  <ParamProgressionScatterPlot
                    allPerWbParameters={perWbParameters}
                  />
                </CardContent>
              </Card>

              <Card className="w-1/2 flex flex-col justify-between">
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
                  <ParamProgressionBarChart
                    allPerWbParameters={perWbParameters}
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
                <AllParamsRelationshipPcp
                  allPerWbParameters={perWbParameters}
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
                <TwoParamsRelationshipScatter
                  allPerWbParameters={perWbParameters}
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
                <ComparisonWbsRadar
                  allPerWbParameters={perWbParameters}
                  setModalMessage={setModalMessage}
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
