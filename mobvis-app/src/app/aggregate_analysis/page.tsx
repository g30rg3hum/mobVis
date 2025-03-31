"use client";

import HyperLink from "@/components/custom/hyperlink";
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
  convertHoursToMinutesAndTrunc,
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
  const [totalWalkingDurationMins, setTotalWalkingDurationMins] = useState<
    number | null
  >(null);

  // inputs dialog state.
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);

  useEffect(() => {
    setInputs(getAndParseStorageItem("inputs"));
    setAggregateParameters(getAndParseStorageItem("aggregate_parameters"));
    setPerWbParameters(getAndParseStorageItem("per_wb_parameters"));
    setTotalWalkingDurationMins(
      convertHoursToMinutesAndTrunc(
        Number(localStorage.getItem("total_walking_duration"))
      )
    );
  }, []);

  if (
    inputs &&
    aggregateParameters &&
    perWbParameters &&
    totalWalkingDurationMins
  ) {
    return (
      <div className="flex justify-center flex-col items-center">
        <div className="text-black max-w-[1300px] my-10">
          <h1 className="text-4xl font-bold mb-2">
            📦 Aggregate-level analysis
          </h1>
          <p className="mb-5">
            <HyperLink url="" onClick={() => setIsInputDialogOpen(true)}>
              Click here
            </HyperLink>{" "}
            to see the inputs you&apos;ve submitted for the current analysis.
          </p>

          <p>
            Visualisations for aggregate gait parameters extracted from{" "}
            <span className="font-semibold">{inputs.name}</span>. This is the
            highest level of analysis you can do, focused on summary metrics
            (e.g. mean, median) of the per-walking bout values of each gait
            parameter.
          </p>
          <InputsDialog
            inputs={inputs}
            isInputDialogOpen={isInputDialogOpen}
            setIsInputDialogOpen={setIsInputDialogOpen}
          />
        </div>
        <div className="flex justify-center mb-10">
          <div className="flex flex-col gap-5 w-full max-w-[1300px] min-w-[1150px] mx-6">
            <div className="flex justify-center gap-5">
              <StatCard
                name="Total detected walking bouts"
                value={perWbParameters.length}
              />
              <StatCard
                name="Total walking duration"
                description="over all detected walking bouts, rounded to nearest min"
                value={
                  totalWalkingDurationMins +
                  " min" +
                  (totalWalkingDurationMins > 1 ? "s" : "")
                }
              />
            </div>

            <Card>
              <CardHeader>
                <VizCardTitle>Table of all aggregate parameters</VizCardTitle>
                <VizCardDescription
                  mainDescription={
                    "Tabular view of the exact figures of the aggregate values (average, maximum, minimum and variance) for each gait parameter. You can reorder the rows to move them closer and compare specific parameters."
                  }
                  exampleAnalysis="what is the precise walking speed that the patient walks at on average?"
                />
              </CardHeader>
              <CardContent className="flex flex-col justify-center gap-10">
                <TableOfAggregateParameters
                  allAggregateParameters={aggregateParameters}
                />
              </CardContent>
            </Card>

            <div className="flex gap-5">
              <Card className="w-1/2">
                <CardHeader>
                  <VizCardTitle>
                    Distribution of a given parameter (box/violin plot)
                  </VizCardTitle>
                  <VizCardDescription
                    mainDescription={
                      "A visualisation that is convertible between violin and box plot. The violin plot shows the distribution of values by the area of the density curves, and the box plot shows the key distribution points (maximum, upper quartile, median, lower quartile, minimum). The focus is on the distribution of a given gait parameter (across identified walking bouts), which can be changed with the dropdown."
                    }
                    exampleAnalysis="how much does this patient’s stride length vary across all the walking bouts?"
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-10">
                  <ParameterDistributionViolinPlot
                    allPerWbParameters={perWbParameters}
                  />
                </CardContent>
              </Card>

              <Card className="w-1/2">
                <CardHeader>
                  <VizCardTitle>
                    Distribution of a given parameter (histogram)
                  </VizCardTitle>
                  <VizCardDescription
                    mainDescription={
                      "A histogram depicting the frequency of a given gait parameter’s values over identified walking bouts. It visualises distribution like the visualisation above, but it is simpler and there is a clearer and direct view of actual parameter values, as opposed to curves which have a smoothing effect. The focus parameter can be manipulated in the same way."
                    }
                    exampleAnalysis="what is the most frequent value range for cadence? This may be considered alongside the mean."
                  />
                </CardHeader>
                <CardContent className="flex flex-col justify-center gap-10">
                  <ParameterDistributionHistogram
                    allPerWbParameters={perWbParameters}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // TODO: render not found form if no inputs submitted.
    return <div>No data can be found...</div>;
  }
}
