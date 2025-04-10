"use client";

import FadeInScroll from "@/components/custom/animation-scroll";
import HyperLink from "@/components/custom/hyperlink";
import LookingForData from "@/components/custom/looking-for-data";
import ParameterDistributionHistogram from "@/components/page-specific/aggregate_analysis/parameter-distribution-histogram";
import ParameterDistributionViolinPlot from "@/components/page-specific/aggregate_analysis/parameter-distribution-violin-plot";
import TableOfAggregateParameters from "@/components/page-specific/aggregate_analysis/table-of-aggregate-parameters";
import InputsDialog from "@/components/page-specific/inputs/inputs-dialog";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/shadcn-components/card";
import StatCard from "@/components/viz/stat-card";
import VizCardDescription from "@/components/viz/viz-card-description";
import VizCardTitle from "@/components/viz/viz-card-title";
import {
  convertHoursToReadableForm,
  getAndParseStorageItem,
} from "@/lib/utils";
import {
  AggregateParameters,
  InputsJson,
  PerWbParameters,
} from "@/types/parameters";
import { useEffect, useState } from "react";

export default function AggregateAnalysis() {
  // need to ensure inputs are being set with localStorage on the client side.
  const [inputs, setInputs] = useState<InputsJson | null>(null);
  const [aggregateParameters, setAggregateParameters] =
    useState<AggregateParameters | null>(null);
  const [perWbParameters, setPerWbParameters] =
    useState<PerWbParameters | null>(null);
  const [totalWalkingDuration, setTotalWalkingDuration] = useState<
    string | null
  >(null);

  // inputs dialog state.
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);

  useEffect(() => {
    setInputs(getAndParseStorageItem("inputs"));
    setAggregateParameters(getAndParseStorageItem("aggregate_parameters"));
    setPerWbParameters(getAndParseStorageItem("per_wb_parameters"));
    setTotalWalkingDuration(
      convertHoursToReadableForm(
        Number(localStorage.getItem("total_walking_duration"))
      )
    );
  }, []);

  if (
    inputs &&
    aggregateParameters &&
    perWbParameters &&
    totalWalkingDuration !== null
  ) {
    return (
      <div className="flex justify-center flex-col items-center">
        <div className="text-black max-w-[1300px] my-10">
          <h1 className="text-4xl font-black mb-2">
            📦 Summary-level analysis
          </h1>
          <p className="mb-5 text-slate-600 font-semibold">
            <HyperLink url="" onClick={() => setIsInputDialogOpen(true)}>
              Click here
            </HyperLink>{" "}
            to see the inputs you&apos;ve submitted for the current analysis.
          </p>

          <p>
            Visualisations for aggregate gait parameters extracted from{" "}
            <span className="font-semibold">&apos;{inputs.name}&apos;</span>.
            This is the highest level of analysis you can do, focused on summary
            metrics (e.g. mean, median) of the values of each gait parameter
            across all identified walking bouts from the recording you
            submitted.
          </p>
          <InputsDialog
            inputs={inputs}
            isInputDialogOpen={isInputDialogOpen}
            setIsInputDialogOpen={setIsInputDialogOpen}
          />
        </div>
        <div className="flex justify-center mb-10">
          <div className="flex flex-col gap-5 w-full max-w-[1300px] min-w-[1150px] mx-6">
            <div className="flex justify-center gap-5 items-stretch">
              <FadeInScroll className="w-1/2 h-full">
                <StatCard
                  name="Total detected walking bouts"
                  value={perWbParameters.length}
                />
              </FadeInScroll>

              <FadeInScroll className="w-1/2">
                <StatCard
                  name="Total walking duration"
                  description="over all detected walking bouts (rounded to nearest sec/min/hr)"
                  value={totalWalkingDuration}
                />
              </FadeInScroll>
            </div>

            <FadeInScroll>
              <Card>
                <CardHeader>
                  <VizCardTitle>Table of all aggregate parameters</VizCardTitle>
                  <VizCardDescription
                    subheading={
                      "Table view of the exact figures of the aggregate values (average, maximum, minimum and variance) for each gait parameter."
                    }
                    descriptions={[
                      "You can reorder the rows to move them closer and compare specific parameters.",
                    ]}
                    exampleAnalysis="what is the precise walking speed that the patient walks at on average?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-10">
                  <TableOfAggregateParameters
                    allAggregateParameters={aggregateParameters}
                  />
                </CardContent>
              </Card>
            </FadeInScroll>

            <div className="flex gap-5 items-stretch">
              <FadeInScroll className="w-1/2 h-full">
                <Card>
                  <CardHeader>
                    <VizCardTitle>
                      Distribution of a gait parameter (box/violin plot)
                    </VizCardTitle>
                    <VizCardDescription
                      subheading="A visualisation that is convertible between violin and box plot. The violin plot shows the distribution of values by the area of the density curves. Wider areas of the curve represent a higher density/frequency of values. Meanwhile, the box plot shows the key distribution points. The highest, middle and lowest horizontal lines represent the max, median and min respectively. The box area represents the interquartile range, where the middle 50% of the data lies, thus representing spread of central data."
                      descriptions={[
                        "The focus is on the distribution of values for a focus gait parameter across all identified walking bouts. You can change the focus parameter using the dropdown and switch between box and violin plot using the checkbox.",
                      ]}
                      exampleAnalysis="how much does this patient’s stride length vary across all the walking bouts?"
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col justify-center gap-10">
                    <ParameterDistributionViolinPlot
                      allPerWbParameters={perWbParameters}
                    />
                  </CardContent>
                </Card>
              </FadeInScroll>

              <FadeInScroll className="w-1/2 h-full">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <VizCardTitle>
                      Distribution of a given parameter (histogram)
                    </VizCardTitle>
                    <VizCardDescription
                      subheading="This histogram shows the frequency of each value interval for a given focus gait parameter over all identified walking bouts. This visualises distribution like the violin/box plot on the left, but here it is possible to determine the precise frequencies of each value range. This is tough to do with the smoothed curves of the violin plot."
                      descriptions={[
                        "The histogram is isolated to a single, focus gait parameter. You can change this using the dropdown below.",
                      ]}
                      exampleAnalysis="what is the most frequent value range for cadence? How does this differ from the mean cadence? How is this compared to the frequency of other value ranges?"
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col justify-center gap-10">
                    <ParameterDistributionHistogram
                      allPerWbParameters={perWbParameters}
                    />
                  </CardContent>
                </Card>
              </FadeInScroll>
            </div>
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
