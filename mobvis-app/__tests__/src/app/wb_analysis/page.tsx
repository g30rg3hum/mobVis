import { cleanup, render, screen, within } from "@testing-library/react";
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

  it("should show entered inputs when link is clicked on", async () => {
    const link = screen.getByText("Click here");
    await userEvent.click(link);
    const dialog = screen.getByTestId("inputs-dialog");
    expect(within(dialog).getByText(sampleInputs.name)).toBeInTheDocument();
    expect(
      within(dialog).getByText(sampleInputs.description)
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(sampleInputs.patientHeight)
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(sampleInputs.sensorHeight)
    ).toBeInTheDocument();
    expect(within(dialog).getByText(sampleInputs.setting)).toBeInTheDocument();
    expect(within(dialog).getByText(sampleInputs.csvFile)).toBeInTheDocument();
    expect(
      within(dialog).getByText(sampleInputs.convertToMs.toString())
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(sampleInputs.public.toString())
    ).toBeInTheDocument();
  });

  it("sorting function works (just test for wb_id)", async () => {
    const sortButton = screen.getAllByTestId("sort-icon")[0];
    await userEvent.click(sortButton);

    const table = screen.getByTestId("per-wb-params-table");
    const rows = within(table).getAllByTestId("table-wb-row");
    const firstRow = rows[0];
    const lastRow = rows[rows.length - 1];
    expect(within(firstRow).getByText("0")).toBeInTheDocument();
    expect(within(lastRow).getByText("4")).toBeInTheDocument();
  });

  it("groups walking bouts correctly", async () => {
    const groupRecordsInput = screen.getByTestId("group-records-input");
    await userEvent.clear(groupRecordsInput);
    await userEvent.type(groupRecordsInput, "2");

    const tablePaginationButtons = screen.getAllByTestId(
      "table-pagination-button"
    );
    // there are 5 records so there should be 3 "pages"
    expect(tablePaginationButtons).toHaveLength(3);

    // click on the second button
    await userEvent.click(tablePaginationButtons[1]);

    // get all the rows.
    const table = screen.getByTestId("per-wb-params-table");
    const rows = within(table).getAllByTestId("table-wb-row");

    // expect the second row tobe record with ID 3
    const secondRow = rows[1];
    expect(within(secondRow).getByText("3")).toBeInTheDocument();
  });
});
