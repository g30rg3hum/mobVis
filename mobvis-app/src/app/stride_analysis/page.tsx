"use client";

import HyperLink from "@/components/custom/hyperlink";
import InputsDialog from "@/components/page-specific/inputs/inputs-dialog";
import ModalMessageDialog from "@/components/page-specific/shared/modal-message-dialog";
import RelationshipBetweenAllGaitParametersPcp from "@/components/page-specific/stride_analysis/relationship-between-all-gait-parameter-pcp";
import StrideComparisonRadarChart from "@/components/page-specific/stride_analysis/stride-comparison-radar-chart";
import StrideParamDistributionHistogram from "@/components/page-specific/stride_analysis/stride-param-distribution-histogram";
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

            {/* <div className="flex gap-5"> */}
            <Card>
              <CardHeader>
                <VizCardTitle>
                  Distribution of a given parameter (violin + box plot)
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "A violin/box plot that shows the distribution of values. You can switch between a violin and box plot using the checkbox. The violin version looks at distribution by the area of the density curves, while the box plot displays key distribution points (max, upperquartile, median, lower quartile and min). The focus is on the distribution of a given gait parameter across all strides for a given walking bout. You can add up to five violins/boxes (walking bouts) and the focus gait parameter can be changed with the dropdown."
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

            <Card>
              <CardHeader>
                <VizCardTitle>
                  Distribution of a given parameter (histogram)
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "A histogram depicting the frequency of a given gait parameter's values across strides. It visualises distribution like above, but it is simpler and there is a clearer and direct view of concrete parameter values, as opposed to curves (which have a smoothing effect) and boxes (which summarise and 'over-simplify' distribution). Histograms for more than one walking bout can be added (up to 3). The focus parameter can be changed using the dropdown. There is also the option of separating the histogram of a walking bout into left and right strides; but this is only available for when only displaying one walking bout, to maintain a clear analysis."
                  }
                  exampleAnalysis="what is the most frequent value range for cadence? How does this compare against the mean value?"
                />
              </CardHeader>
              <CardContent className="flex flex-col justify-center gap-5">
                <StrideParamDistributionHistogram
                  allPerStrideParameters={perStrideParameters}
                  setModalMessage={setModalMessage}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <VizCardTitle>
                  Relationship between all gait parameters (parallel coordinates
                  plot)
                </VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "A parallel coordinates plot with an axis for each gait parameter. Each stride is plotted as a polyline through these axes. The patterns of how these polylines cross and converge through these axes can reveal relationships between the gait parameters. This visualisation is limited to strides of three walking bouts at a time. In the same way as the histogram above, you can only split the polylines into left and right strides if only one walking bout is selected."
                  }
                  exampleAnalysis="are the data lines between two axes mostly parallel, i.e. indicating a positive correlation?"
                />
              </CardHeader>
              <CardContent className="flex flex-col justify-center gap-5">
                <RelationshipBetweenAllGaitParametersPcp
                  allPerStrideParameters={perStrideParameters}
                  setModalMessage={setModalMessage}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <VizCardTitle>
                  Comparison between strides (radar chart)
                </VizCardTitle>
                <VizCardDescription
                  mainDescription="A radar chart with axes for each gait parameter, plotting against identified strides from walking bouts that you select to add from the dropdown. Representing the strides as shapes provide straightforward insights about how the strides compare across each dimension (gait parameter). You can plot for up to three strides, to avoid the chart getting too cluttered."
                  exampleAnalysis="are the data lines between two axes mostly parallel, i.e. indicating a positive correlation?"
                />
              </CardHeader>
              <CardContent className="flex flex-col justify-center gap-5">
                <StrideComparisonRadarChart
                  allPerStrideParameters={perStrideParameters}
                  setModalMessage={setModalMessage}
                />
              </CardContent>
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
