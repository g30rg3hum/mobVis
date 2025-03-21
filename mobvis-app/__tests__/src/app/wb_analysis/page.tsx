import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  sampleInputs,
  samplePerWbParameters,
} from "../../../../test_helpers/sample_data";
import { LocalStorageMock } from "../../../../test_helpers/mocks";
import WbAnalysis from "@/app/wb_analysis/page";

describe("WbAnalysis", () => {
  beforeAll(() => {
    global.localStorage = new LocalStorageMock();
    // set the local storage items required
    localStorage.setItem("inputs", JSON.stringify(sampleInputs));
    // localStorage.setItem(
    //   "aggregate_parameters",
    //   JSON.stringify(sampleAggregateParameters)
    // );
    // localStorage.setItem(
    //   "total_walking_duration",
    //   sampleTotalWalkingDuration.toString()
    // );
    localStorage.setItem(
      "per_wb_parameters",
      JSON.stringify(samplePerWbParameters)
    );
  });

  beforeEach(() => {
    render(<WbAnalysis />);
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    localStorage.clear();
  });

  it("should show entered input when link is clicked on", async () => {
    const link = screen.getByText("Click here");
    await userEvent.click(link);
    expect(screen.getAllByText(sampleInputs.name)).toHaveLength(2);
    expect(screen.getByText(sampleInputs.description)).toBeInTheDocument();
    expect(screen.getByText(sampleInputs.patientHeight)).toBeInTheDocument();
    expect(screen.getByText(sampleInputs.sensorHeight)).toBeInTheDocument();
    expect(screen.getByText(sampleInputs.setting)).toBeInTheDocument();
    expect(screen.getByText(sampleInputs.csvFile)).toBeInTheDocument();
    expect(
      screen.getByText(sampleInputs.convertToMs.toString())
    ).toBeInTheDocument();
    expect(
      screen.getByText(sampleInputs.public.toString())
    ).toBeInTheDocument();
  });
});
