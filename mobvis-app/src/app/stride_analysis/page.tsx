"use client";

import FadeInScroll from "@/components/custom/animation-scroll";
import HyperLink from "@/components/custom/hyperlink";
import LookingForData from "@/components/custom/looking-for-data";
import InputsDialog from "@/components/page-specific/inputs/inputs-dialog";
import ModalMessageDialog from "@/components/page-specific/shared/modal-message-dialog";
import RelationshipBetweenAllGaitParametersPcp from "@/components/page-specific/stride_analysis/relationship-between-all-gait-parameter-pcp";
import StrideComparisonHeatMap from "@/components/page-specific/stride_analysis/stride-comparison-heat-map";
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
      <div className="flex flex-col items-center justify-center">
        <div className="text-black max-w-[1300px] my-10">
          <h1 className="text-4xl font-black mb-2">
            🦶 Analysis on each stride
          </h1>
          <p className="mb-5 text-slate-600 font-semibold">
            <HyperLink url="" onClick={() => setIsInputDialogOpen(true)}>
              Click here
            </HyperLink>{" "}
            to see the inputs you&apos;ve submitted for the current analysis.
          </p>

          <p>
            Visualisations for gait parameters extracted from{" "}
            <span className="font-semibold">&apos;{inputs.name}&apos;</span>.
            This is the lowest level of analysis you can do, focused on the
            values of each gait parameter under each left and right strides of
            the identified walking bouts, from the recording you submitted.
          </p>
          <InputsDialog
            inputs={inputs}
            isInputDialogOpen={isInputDialogOpen}
            setIsInputDialogOpen={setIsInputDialogOpen}
          />
        </div>

        <div className="flex justify-center mb-10">
          <div className="flex flex-col gap-5 w-full max-w-[1300px] min-w-[1150px] mx-6">
            <FadeInScroll>
              <Card>
                <CardHeader>
                  <VizCardTitle>
                    Table of all gait parameters of each stride under each
                    walking bout
                  </VizCardTitle>
                  <VizCardDescription
                    subheading="Table view of the exact figures of each gait parameter for each identified stride made under each identified walking bout."
                    descriptions={[
                      "Use this table to assist your decision in picking what walking bouts to visualise for, in the visualisations below.",
                      "Drag rows around to compare selected strides side by side.",
                      "Click the left and right buttons to view the strides of a desired walking bout.",
                      "You can also set the number of stride records displayed in each group using the input textbox, and navigate between different groups using the numbers at the bottom.",
                      "Please note that if a value is N/A, it means that the gait parameter could not be calculated for that stride.",
                    ]}
                    exampleAnalysis="which walking bout contained the stride with the largest length?"
                  />
                </CardHeader>
                <CardContent className="space-y-5">
                  <TableOfPerStrideParameters
                    allPerStrideParameters={perStrideParameters}
                  />
                </CardContent>
              </Card>
            </FadeInScroll>

            <div className="flex gap-5 items-stretch">
              <FadeInScroll className="w-1/2">
                <Card className="h-full">
                  <CardHeader>
                    <VizCardTitle>
                      Progression of a gait parameter over time (scatter/step
                      plot)
                    </VizCardTitle>
                    <VizCardDescription
                      subheading="A plot that is switchable between a scatter plot and step plot. Values for a focus gait parameter is plotted for each chronological stride of a given selected walking bout. By ordering the strides chronologically, you can determine how the focus gait parameter evolves over time with each step."
                      descriptions={[
                        "Alternate between a connected and a step plot by clicking on the checkbox below.",
                        "Choose the current walking bout to visualise using the left and right buttons.",
                        "Change the focus parameter by using the dropdown.",
                        "Hover over the points to see the corresponding gait parameter values.",
                      ]}
                      exampleAnalysis="as more strides are taken, does the stride length decrease? Are there frequent dips in walking speed every time it's a left stride, indicating there is something wrong with the left leg?"
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col justify-center gap-10">
                    <StrideParamProgressionScatterPlot
                      allPerStrideParameters={perStrideParameters}
                    />
                  </CardContent>
                </Card>
              </FadeInScroll>

              <FadeInScroll className="w-1/2">
                <Card className="flex flex-col justify-start h-full">
                  <CardHeader>
                    <VizCardTitle>
                      Progression of a gait parameter (over time) (bar chart)
                    </VizCardTitle>
                    <VizCardDescription
                      subheading="A bar chart that is similar to the scatter plot on the left. The focus gait parameter is plotted for each chronological stride of a given selected walking bout. With the chronological order of strides and the more intuitive visual comparison provided by the bar structure, you can easily interpret and compare how the focus gait parameter evolves over time with each step. "
                      descriptions={[
                        "Pick the walking bout to plot the strides of using the left and right buttons.",
                        "Pick the focus gait parameter using the dropdown.",
                      ]}
                      exampleAnalysis="do the bars of each chronological stride decrease steadily for gait speed and if so, by how much each time?"
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col justify-center gap-10">
                    <StrideParamProgressionBarChart
                      allPerStrideParameters={perStrideParameters}
                    />
                  </CardContent>
                </Card>
              </FadeInScroll>
            </div>

            <FadeInScroll>
              <Card>
                <CardHeader>
                  <VizCardTitle>
                    Distribution of a given parameter (violin + box plot)
                  </VizCardTitle>
                  <VizCardDescription
                    subheading="A plot that can be alternated between a box and violin plot, showing the distribution of a gait parameter's values across all the strides for a given walking bout. The violin version looks at distribution by the area of the density curves, with wider areas indicating more values in that range. On the other hand, the box plot displays key distribution points (max - upper line, min - lower line, median - middle line, interquartile range - the box (where the middle 50% of values live, between the 25% and 75% of values))."
                    descriptions={[
                      "You can plot for up to five violins/boxes (each representing a specific walking bout).",
                      "The focus gait parameter can be changed with the dropdown.",
                      "There is a checkbox to switch between a box plot and violin plot.",
                      "For the box plot, you can hover over the horizontal lines to see the exact values of the max, min, etc.",
                      "For the violin plot, you can manipulate the number of bins (no. of intervals to divide the data into) using the slider.",
                    ]}
                    exampleAnalysis="how much does this patient's stride length vary across the strides of one walking bout compared to another walking bout?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-5">
                  <StrideParamDistributionViolinPlot
                    allPerStrideParameters={perStrideParameters}
                    setModalMessage={setModalMessage}
                  />
                </CardContent>
              </Card>
            </FadeInScroll>

            <FadeInScroll>
              <Card>
                <CardHeader>
                  <VizCardTitle>
                    Distribution of a given parameter (histogram)
                  </VizCardTitle>
                  <VizCardDescription
                    subheading="A histogram depicting the frequency of a given gait parameter's values across all strides of specific walking bouts. It visualises distribution like in the violin/box plot above, but it is simpler and there is a clearer and direct view of concrete parameter values and frequencies, as opposed to smoothed curves and boxes (which summarise and over-simplify distribution)."
                    descriptions={[
                      "Histograms for more than one walking bout can be added (up to 3).",
                      "The focus parameter can be changed using the dropdown.",
                      "There is also the option of separating the histogram of a walking bout into left and right strides; but this is only available for when only displaying one walking bout, to maintain a clear analysis.",
                      "Manipulate the number of bins (no. of intervals to split the data into) using the slider.",
                      "Hover over the bars to view the interval range and corresponding frequency. Please note that if bars overlap, the range/frequency of the top bar (the histogram plotted the latest) will be displayed.",
                    ]}
                    exampleAnalysis="what is the most frequent value range for cadence for a given walking bout? How does this compare against the mean value? How does this compare with the frequency of the rest of the value ranges?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-5">
                  <StrideParamDistributionHistogram
                    allPerStrideParameters={perStrideParameters}
                    setModalMessage={setModalMessage}
                  />
                </CardContent>
              </Card>
            </FadeInScroll>

            <FadeInScroll>
              <Card>
                <CardHeader>
                  <VizCardTitle>
                    Relationship between all gait parameters (parallel
                    coordinates plot)
                  </VizCardTitle>
                  <VizCardDescription
                    subheading="A parallel coordinates plot with an axis for each gait parameter. Each stride of a given walking bout is plotted as a data line through these axes. The patterns of how these data lines converge and cluster through these axes reveal relationships between the many gait parameters. Lots of different analytical conclusions can be done from this plot: from identifying outliers (lines that deviate from the rest) to identifying correlations (positive - parallel lines between axes, negative - crossing lines between, none - mix of parallel and crossing)"
                    descriptions={[
                      "This visualisation is limited to plotting the strides of three walking bouts at a time.",
                      "In the same way as the histogram above, you can only split the data lines into left and right strides if only one walking bout is selected.",
                      "You can also colour the data lines by a selected colour, but please note that this colour is isolated so the preset colour scheme won't be applicable. If you want to remove the colour, refresh the page, or remove and re-add the corresponding walking bout again.",
                      "Hover over a data line to see the respective (walking bout ID, stride ID).",
                      "You can also shift a selected gait parameter axis to another position using the dropdowns.",
                    ]}
                    exampleAnalysis="are the data lines between two gait parameter axes mostly parallel, i.e. indicating a positive correlation?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-5">
                  <RelationshipBetweenAllGaitParametersPcp
                    allPerStrideParameters={perStrideParameters}
                    setModalMessage={setModalMessage}
                  />
                </CardContent>
              </Card>
            </FadeInScroll>

            <FadeInScroll>
              <Card>
                <CardHeader>
                  <VizCardTitle>
                    Comparison between strides (radar chart)
                  </VizCardTitle>
                  <VizCardDescription
                    subheading="A radar chart with axes for each gait parameter, plotting against identified strides from walking bouts that you select from the dropdowns. Representing the strides as shapes provides straightforward insights about how different strides compare across each dimension (gait parameter)."
                    descriptions={[
                      "You can plot for up to three strides from any walking bouts, to avoid the chart getting too cluttered.",
                      "Use the dropdowns to swap two selected axes positions.",
                      "Hover over the points on the axes to see the exact values.",
                    ]}
                    exampleAnalysis="For which gait parameters does one stride have higher values for compared to another selected stride?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-5">
                  <StrideComparisonRadarChart
                    allPerStrideParameters={perStrideParameters}
                    setModalMessage={setModalMessage}
                  />
                </CardContent>
              </Card>
            </FadeInScroll>

            <FadeInScroll>
              <Card>
                <CardHeader>
                  <VizCardTitle>
                    Comparison between strides (heat map)
                  </VizCardTitle>
                  <VizCardDescription
                    subheading="A heatmap of a focus gait parameter's values for each stride of selected walking bouts. The y-axis represents the selected walking bouts and the x-axis displays each corresponding chronological numbered stride (e.g. first stride, second stride...). The colour coding of the heatmap offers a clearer view and comparison of which strides have the highest/lowest values for the given gait parameter."
                    descriptions={[
                      "If walking bouts have unequal stride counts, unavailable strides will be blacked out.",
                      "Select walking bouts to add and the focus gait parameter using the dropdown. You can add up to 10 walking bouts at a time.",
                      "Hover over the cells to see the exact values of the gait parameter.",
                    ]}
                    exampleAnalysis="which set of strides of a given walking bout have extremely long durations?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-5">
                  <StrideComparisonHeatMap
                    allPerStrideParameters={perStrideParameters}
                    setModalMessage={setModalMessage}
                  />
                </CardContent>
              </Card>
            </FadeInScroll>
          </div>
        </div>
        <ModalMessageDialog
          modalMessage={modalMessage}
          setModalMessage={setModalMessage}
        />
      </div>
    );
  } else {
    return (
      <div className="flex justify-center mt-20">
        <LookingForData />
      </div>
    );
  }
}
