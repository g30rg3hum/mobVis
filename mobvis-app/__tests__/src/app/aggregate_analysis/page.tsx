import { cleanup, render, screen, within } from "@testing-library/react";
import { LocalStorageMock } from "../../../../test_helpers/mocks";
import AggregateAnalysis from "@/app/aggregate_analysis/page";
import {
  sampleAggregateParameters,
  sampleInputs,
  samplePerWbParameters,
  sampleTotalWalkingDuration,
} from "../../../../test_helpers/sample_data";
import { convertHoursToMinutesAndTrunc, roundToNDpIfNeeded } from "@/lib/utils";
import { MotionGlobalConfig } from "framer-motion";

describe("AggregateAnalysis", () => {
  beforeAll(() => {
    MotionGlobalConfig.skipAnimations = true;

    global.localStorage = new LocalStorageMock();
    // set the local storage items required
    localStorage.setItem("inputs", JSON.stringify(sampleInputs));
    localStorage.setItem(
      "aggregate_parameters",
      JSON.stringify(sampleAggregateParameters)
    );
    localStorage.setItem(
      "total_walking_duration",
      sampleTotalWalkingDuration.toString()
    );
    localStorage.setItem(
      "per_wb_parameters",
      JSON.stringify(samplePerWbParameters)
    );
  });

  beforeEach(() => {
    render(<AggregateAnalysis />);
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    localStorage.clear();
  });

  it("shows the total detected walking bouts", () => {
    const header = screen.getByText(/total detected walking bouts/i);
    expect(header).toBeInTheDocument();
    const value = screen.getByText(samplePerWbParameters.length);
    expect(value).toBeInTheDocument();
  });

  it("shows the total walking duration in minutes", () => {
    const header = screen.getByText(/total walking duration/i);
    expect(header).toBeInTheDocument();
    const value = convertHoursToMinutesAndTrunc(sampleTotalWalkingDuration);
    const valueElement = screen.getByText(`${value} mins`);
    expect(valueElement).toBeInTheDocument();
  });

  it("shows a table of aggregate parameters", () => {
    const header = screen.getByText(/table of all aggregate parameters/i);
    expect(header).toBeInTheDocument();

    const table = screen.getByRole("table");
    expect(within(table).getByText(/average/i)).toBeInTheDocument();
    expect(within(table).getByText(/maximum/i)).toBeInTheDocument();
    expect(within(table).getByText(/minimum/i)).toBeInTheDocument();
    expect(within(table).getByText(/variance/i)).toBeInTheDocument();

    expect(within(table).getByText(/number of strides/i)).toBeInTheDocument();
    const nStrides = sampleAggregateParameters.find(
      (param) => param.param === "n_strides"
    )!;
    expect(
      within(table).getByText(roundToNDpIfNeeded(nStrides.avg, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(nStrides.max, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(nStrides.min, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(nStrides.var, 5))
    ).toBeInTheDocument();

    expect(within(table).getByText(/duration/i)).toBeInTheDocument();
    const duration = sampleAggregateParameters.find(
      (param) => param.param === "duration_s"
    )!;
    expect(
      within(table).getByText(roundToNDpIfNeeded(duration.avg, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(duration.max, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(duration.min, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(duration.var, 5))
    ).toBeInTheDocument();

    expect(within(table).getByText(/cadence/i)).toBeInTheDocument();
    const cadence = sampleAggregateParameters.find(
      (param) => param.param === "cadence_spm"
    )!;
    expect(
      within(table).getByText(roundToNDpIfNeeded(cadence.avg, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(cadence.max, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(cadence.min, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(cadence.var, 5))
    ).toBeInTheDocument();

    expect(within(table).getByText(/stride length/i)).toBeInTheDocument();
    const strideLength = sampleAggregateParameters.find(
      (param) => param.param === "stride_length_m"
    )!;
    expect(
      within(table).getByText(roundToNDpIfNeeded(strideLength.avg, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(strideLength.max, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(strideLength.min, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(strideLength.var, 5))
    ).toBeInTheDocument();

    expect(within(table).getByText(/walking speed/i)).toBeInTheDocument();
    const walkingSpeed = sampleAggregateParameters.find(
      (param) => param.param === "walking_speed_mps"
    )!;
    expect(
      within(table).getByText(roundToNDpIfNeeded(walkingSpeed.avg, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(walkingSpeed.max, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(walkingSpeed.min, 5))
    ).toBeInTheDocument();
    expect(
      within(table).getByText(roundToNDpIfNeeded(walkingSpeed.var, 5))
    ).toBeInTheDocument();
  });
});
