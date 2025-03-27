"use client";

import HyperLink from "@/components/custom/hyperlink";
import InputsDialog from "@/components/page-specific/inputs/inputs-dialog";
import ModalMessageDialog from "@/components/page-specific/shared/modal-message-dialog";
import StrideParamDistributionViolinPlot from "@/components/page-specific/stride_analysis/stride-param-distribution-violin-plot";
import StrideParamProgressionBarChart from "@/components/page-specific/stride_analysis/stride-param-progression-bar-chart";
import StrideParamProgressionScatterPlot from "@/components/page-specific/stride_analysis/stride-param-progression-scatter-plot";
import TableOfPerStrideParameters from "@/components/page-specific/stride_analysis/table-of-per-stride-parameters";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/shadcn-components/card";
import VizCardDescription from "@/components/viz/viz-card-description";
import VizCardTitle from "@/components/viz/viz-card-title";
import { getAndParseStorageItem } from "@/lib/utils";
import { InputsJson, PerStrideParameters } from "@/types/parameters";
import { useEffect, useState } from "react";

export default function StrideAnalysis() {
  const [inputs, setInputs] = useState<InputsJson | null>(null);
  const [perStrideParameters, setPerStrideParameters] =
    useState<PerStrideParameters | null>(null);

  useEffect(() => {
    setInputs(getAndParseStorageItem("inputs"));
    setPerStrideParameters(getAndParseStorageItem("per_stride_parameters"));
  }, []);

  // inputs dialog
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);

  // modal message
  const [modalMessage, setModalMessage] = useState<string | undefined>(
    undefined
  );

  if (inputs && perStrideParameters) {
    return (
      <div>
        <div className="p-10 text-white">
          <h1 className="text-4xl font-bold mb-2">🦶 Stride level analysis</h1>
          <p>
            Walking bouts are made up of left and right strides. Visualisations
            for per walking bout gait parameters extracted from{" "}
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
                  Table of all parameters of each stride under each walking bout
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "Tabular view of the exact figures of each gait parameter for each identified stride of each identified walking bout in the CSV data you uploaded. Use this table to assist your decision in picking what walking bouts to visualise for, in the visualisations below. Drag rows around to compare selected records side by side. Click the left and right buttons to view the strides of a desired walking bout. You can also set the number of stride records displayed with the input textbox. Please note that if a value is 0, it means that the value could not be calculated."
                  }
                  exampleAnalysis="which walking bout contained the stride with the largest length?"
                />
              </CardHeader>
              <CardContent className="space-y-5">
                <TableOfPerStrideParameters
                  allPerStrideParameters={perStrideParameters}
                />
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
                      "Plot of a focus gait parameter of strides of a given selected walking bout. The walking bouts are ordered chronologically to look for any temporal relationships. More specifically, how does the focus gait parameter evolve over time for the given walking bout? The plot can be displayed as a connected scatter plot or step plot using the checkbox."
                    }
                    exampleAnalysis="as more strides are taken, does the stride length decrease? Are there frequent dips in walking speed every time it's a left stride, indicating there is something wrong with the left leg?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-10">
                  <StrideParamProgressionScatterPlot
                    allPerStrideParameters={perStrideParameters}
                  />
                </CardContent>
              </Card>

              <Card className="w-1/2 flex flex-col justify-between">
                <CardHeader>
                  <VizCardTitle>
                    Progression of a gait parameter (over time) (bar chart)
                  </VizCardTitle>
                  <VizCardDescription
                    mainDescription={
                      "Same as the scatter plot on the left except presented in bar chart form. The 'bar' form may offer a clearer and more straightforward represention of value."
                    }
                    exampleAnalysis="do the bars of each chronological stride decrease steadily for gait speed and if so, by how much each time?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-10">
                  <StrideParamProgressionBarChart
                    allPerStrideParameters={perStrideParameters}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-5">
              <Card className="w-1/2">
                <CardHeader>
                  <VizCardTitle>
                    Distribution of a given parameter (violin plot)
                  </VizCardTitle>
                  <VizCardDescription
                    mainDescription={
                      "A violin plot that shows the distribution of values by the area of the density curves. The focus is on the distribution of a given gait parameter across all strides for a given walking bout. You can add up to three violins (walking bouts) and the gait parameter can be changed with the dropdown"
                    }
                    exampleAnalysis="how much does this patient's stride length vary across the strides of one walking bout compared to another?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-5">
                  <StrideParamDistributionViolinPlot
                    allPerStrideParameters={perStrideParameters}
                    setModalMessage={setModalMessage}
                  />
                </CardContent>
              </Card>
              <Card className="w-1/2">
                <CardHeader>
                  <VizCardTitle>
                    Distribution of a given parameter (box plot)
                  </VizCardTitle>
                  <VizCardDescription
                    mainDescription={
                      "A box plot displays key distribution points (maximum, upper quartile, median, lower quartile and minimum). Essentially this also shows distribution like the violin plot on the left, but it concretely shows key distribution values rather than a smoothed distribution shape. The functions of changing the focus parameter and adding additional walking bouts work the same way as in the violin plot."
                    }
                    exampleAnalysis="how much does this patient’s stride length vary for one walking bout compared to another?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-5"></CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <VizCardTitle>
                  Distribution of a given parameter (histogram)
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "A histogram depicting the frequency of a given gait parameter's values across strides. It visualises distribution like above, but it is simpler and there is a clearer and direct view of actual parameter values, as opposed to curves which have a smoothing effect. Additional histograms for other walking bouts and the focus parameter and walking bout can be manipulated in the same way, however there is a limit of three histograms to avoid clutter. Note that separating the walking bouts into left and right strides will only be available for when only displaying one walking bout, to allow for clearer analysis."
                  }
                  exampleAnalysis="what is the most frequent value range for cadence? How does this compare against the mean value?"
                />
              </CardHeader>
              <CardContent className="space-y-5"></CardContent>
            </Card>
          </div>
        </div>
        <ModalMessageDialog
          modalMessage={modalMessage}
          setModalMessage={setModalMessage}
        />
      </div>
    );
  } else {
    // TODO: amend this.
    return "Loading...";
  }
}
