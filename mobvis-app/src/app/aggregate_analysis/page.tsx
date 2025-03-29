"use client";

import HyperLink from "@/components/custom/hyperlink";
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
      <div>
        <div className="p-10 text-white">
          <h1 className="text-4xl font-bold mb-2">
            📦 Aggregate-level analysis
          </h1>
          <p>
            Visualisations for aggregate gait parameters extracted from{" "}
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
            <div className="flex justify-center gap-5">
              <StatCard
                name="Total detected walking bouts"
                value={perWbParameters.length}
              />
              <StatCard
                name="Total walking duration"
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
                    "Tabular view of the exact figures of the aggregate parameters (average, maximum, minimum and variance) for each gait parameter. You can reorder the rows to compare different parameters."
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

            <div>
              <Card className="w-1/2">
                <CardHeader>
                  <VizCardTitle>
                    Distribution of a given parameter (violin plot)
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
            </div>

            {/* 
              <Card>
                <CardHeader>
                  <VizCardTitle>Overall gait performance</VizCardTitle>
                  <VizCardDescription
                    mainDescription={
                      "Radar chart with each gait parameter as an axis. For each gait parameter, its average value across all walking bouts is plotted."
                    }
                    exampleAnalysis="how does this patient's gait this time around compare against the last assessment?"
                  />
                </CardHeader>
                <CardContent></CardContent>
              </Card>
           */}
          </div>
        </div>
      </div>
    );
  } else {
    // TODO: render not found form if no inputs submitted.
    return <div>No data can be found...</div>;
  }
}
