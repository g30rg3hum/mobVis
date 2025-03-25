import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  sampleInputs,
  samplePerStrideParameters,
} from "../../../../test_helpers/sample_data";
import { LocalStorageMock } from "../../../../test_helpers/mocks";
import StrideAnalysis from "@/app/stride_analysis/page";

describe("WbAnalysis", () => {
  beforeAll(() => {
    global.localStorage = new LocalStorageMock();
    // set the local storage items required
    localStorage.setItem("inputs", JSON.stringify(sampleInputs));
    localStorage.setItem(
      "per_stride_parameters",
      JSON.stringify(samplePerStrideParameters)
    );
  });

  beforeEach(() => {
    render(<StrideAnalysis />);
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    localStorage.clear();
  });

  it("TABLE: sorting function works (test for s_id)", async () => {
    const sortButton = screen.getAllByTestId("sort-icon")[0];
    await userEvent.click(sortButton);

    const table = screen.getByTestId("per-stride-params-table");
    const rows = within(table).getAllByTestId("table-stride-row");
    const firstRow = rows[0];
    const lastRow = rows[rows.length - 1];
    expect(within(firstRow).getByText("11")).toBeInTheDocument();
    expect(within(lastRow).getByText("7")).toBeInTheDocument();
  });

  it("TABLE: sorting function works (test for lr_label)", async () => {
    const sortButton = screen.getAllByTestId("sort-icon")[1];
    await userEvent.click(sortButton);

    const table = screen.getByTestId("per-stride-params-table");
    const rows = within(table).getAllByTestId("table-stride-row");
    const firstRow = rows[0];
    const lastRow = rows[rows.length - 1];
    expect(within(firstRow).getByText("left")).toBeInTheDocument();
    expect(within(lastRow).getByText("left")).toBeInTheDocument();
  });

  it("transitions between walking bouts to focus on", async () => {
    const currentWbId = screen.getByTestId("current-wb-id");
    const previousWbBtn = screen.getByTestId("btn-wb-id-previous");
    const nextWbBtn = screen.getByTestId("btn-wb-id-next");

    expect(currentWbId).toHaveTextContent("0");
    await userEvent.click(nextWbBtn);
    expect(currentWbId).toHaveTextContent("1");
    await userEvent.click(previousWbBtn);
    expect(currentWbId).toHaveTextContent("0");
  });

  it("groups the stride records correctly", async () => {
    const groupRecordsInput = screen.getByTestId("group-records-input");
    await userEvent.clear(groupRecordsInput);
    await userEvent.type(groupRecordsInput, "2");

    const table = screen.getByTestId("per-stride-params-table");
    const rows = within(table).getAllByTestId("table-stride-row");
    expect(rows).toHaveLength(2);
  });

  it("paginates the stride records correctly", async () => {
    const tablePaginationButtons = screen.getAllByTestId(
      "table-pagination-button"
    );
    const table = screen.getByTestId("per-stride-params-table");

    let rows = within(table).getAllByTestId("table-stride-row");
    expect(rows).toHaveLength(5);
    let firstRow = rows[0];
    let lastRow = rows[rows.length - 1];
    expect(within(firstRow).getByText("0")).toBeInTheDocument();
    expect(within(lastRow).getByText("4")).toBeInTheDocument();

    // click on the next page.
    await userEvent.click(tablePaginationButtons[1]);

    rows = within(table).getAllByTestId("table-stride-row");
    expect(rows).toHaveLength(5);
    firstRow = rows[0];
    lastRow = rows[rows.length - 1];
    expect(within(firstRow).getByText("5")).toBeInTheDocument();
    expect(within(lastRow).getByText("9")).toBeInTheDocument();
  });
});
