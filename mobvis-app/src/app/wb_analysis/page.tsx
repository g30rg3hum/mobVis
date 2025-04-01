"use client";
import FadeInScroll from "@/components/custom/animation-scroll";
import HyperLink from "@/components/custom/hyperlink";
import LookingForData from "@/components/custom/looking-for-data";
import InputsDialog from "@/components/page-specific/inputs/inputs-dialog";
import ModalMessageDialog from "@/components/page-specific/shared/modal-message-dialog";
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
      <div className="flex flex-col justify-center items-center">
        <div className="text-black max-w-[1300px] my-10">
          <h1 className="text-4xl font-black mb-2">
            🚶 Analysis on each walking bout
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
            This is the second highest level of analysis you can do, after the
            summary level, focused on the values of each gait parameter under
            each identified walking bout from the recording you submitted.
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
                    Table of all gait parameters under each walking bout
                  </VizCardTitle>
                  <VizCardDescription
                    subheading="Table view of the exact figures of each gait parameter for each identified walking bout in the CSV recording data you uploaded."
                    descriptions={[
                      "Use this table to view exact values for the gait parameters, and also assist your decision in picking what walking bouts to visualise for, in the other visualisations below.",
                      "Drag rows around to compare select records side by side.",
                      "Sort the records by ascending/descending order of a given gait parameter by clicking on the button in the column header.",
                      "There is also a field in which you can set the number of walking bout records in each group to view. Switch between groups by clicking on the number buttons at the bottom.",
                      "Please note that if a value is N/A, it means that the value could not be calculated.",
                    ]}
                    exampleAnalysis="what is the precise walking speed that the patient was walking at in the initial walking bout?"
                  />
                </CardHeader>
                <CardContent className="space-y-5">
                  <TableOfPerWbParameters
                    allPerWbParameters={perWbParameters}
                  />
                </CardContent>
              </Card>
            </FadeInScroll>

            <div className="flex gap-5">
              <FadeInScroll className="w-1/2 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <VizCardTitle>
                      Progression of a gait parameter over time (scatter/step
                      plot)
                    </VizCardTitle>
                    <VizCardDescription
                      subheading="A standard plot that is switchable between a scatter plot and step plot. This is plotted for a focus gait parameter against the identified walking bouts. The walking bouts are ordered chronologically to highlight the gait parameter's values over time."
                      descriptions={[
                        "The focus gait parameter can be changed with the dropdown below",
                        "The plot can be displayed as a either connected scatter plot or step plot by checking the checkbox.",
                      ]}
                      exampleAnalysis="do later walking bouts involve slower gait speeds? Or is the speed consistent throughout the whole assessment?"
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col justify-center gap-10">
                    <ParamProgressionScatterPlot
                      allPerWbParameters={perWbParameters}
                    />
                  </CardContent>
                </Card>
              </FadeInScroll>

              <FadeInScroll className="w-1/2 h-full">
                <Card className="flex flex-col justify-between h-full">
                  <CardHeader>
                    <VizCardTitle>
                      Progression of a gait parameter (over time/ascending
                      duration) (bar chart)
                    </VizCardTitle>
                    <VizCardDescription
                      subheading="Similar to the scatter plot on the left, except represented in typical bar chart form. The 'bar' form offers a different, and perhaps more simple representation and comparison of value."
                      descriptions={[
                        "There is also an additional checkbox setting to sort the walking bouts in increasing order of walking bout duration to see if there is any relationship between WB duration and the focus gait parameter.",
                        "Hover over the individual bars to also see the respective walking bout duration.",
                      ]}
                      exampleAnalysis="do longer walking bouts correlate to shorter gait speeds?"
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col justify-center gap-10">
                    <ParamProgressionBarChart
                      allPerWbParameters={perWbParameters}
                    />
                  </CardContent>
                </Card>
              </FadeInScroll>
            </div>

            <FadeInScroll>
              <Card>
                <CardHeader>
                  <VizCardTitle>
                    Relationship between all gait parameters (parallel
                    coordinates plot)
                  </VizCardTitle>
                  <VizCardDescription
                    subheading="A parallel coordinates plot with an axis for each gait parameter. Each walking bout is a data line through these axes. The patterns of how these data lines cross, converge and cluster through these axes reveal relationships between the many gait parameters. Lots of different analyses conclusions can be done from this plot: from identifying outliers (lines that deviate from the rest) to identifying correlations (positive - parallel lines between, negative - crossing lines between, none - mix of parallel and crossing)."
                    descriptions={[
                      "The axes can be reordered by selecting an axis and the new position to swap it with. You can also hover over data lines to identifying the associated walking bout ID, and click on them to highlight selected lines with your chosen colour.",
                    ]}
                    exampleAnalysis="are the data lines between two axes mostly parallel, i.e. indicating a correlation between the gait parameters?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-2">
                  <AllParamsRelationshipPcp
                    allPerWbParameters={perWbParameters}
                  />
                </CardContent>
              </Card>
            </FadeInScroll>

            <FadeInScroll>
              <Card>
                <CardHeader>
                  <VizCardTitle>
                    Relationship between two gait parameters (scatter plot)
                  </VizCardTitle>
                  <VizCardDescription
                    subheading="A regular scatter plot showing the level of correlation between two gait parameters. A trendline is plotted with an indicated correlation coefficient to quantify the level of correlation.This offers a more isolated and clearer view of correlation between two specific gait parameters, in addition to the parallel coordinates plot above."
                    descriptions={[
                      "Use the dropdowns to select the gait parameters for the x and y axes respectively.",
                      "Hover over the trend line to also see the correlation coefficient. This trendline has been calculated and plotted using the least squares regression formula.",
                    ]}
                    exampleAnalysis="does longer stride length correlate to faster gait speeds?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-10">
                  <TwoParamsRelationshipScatter
                    allPerWbParameters={perWbParameters}
                  />
                </CardContent>
              </Card>
            </FadeInScroll>

            <FadeInScroll>
              <Card>
                <CardHeader>
                  <VizCardTitle>Comparison between walking bouts</VizCardTitle>
                  <VizCardDescription
                    subheading="A radar chart with an axis for each gait parameter. Each 'radar' represents an identified walking bout from the recording you submitted. Representing walking bouts as shapes provides straightforward insights about how the walking bouts compare across each dimension (gait parameter)."
                    descriptions={[
                      "Select walking bouts to plot by using the dropdown. You can plot up to three walking bouts, to avoid the chart getting too cluttered.",
                    ]}
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
            </FadeInScroll>

            <ModalMessageDialog
              modalMessage={modalMessage}
              setModalMessage={setModalMessage}
            />
          </div>
        </div>
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
