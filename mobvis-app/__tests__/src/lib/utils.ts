import { sortWbsByProperty } from "@/lib/utils";
import { samplePerWbParameters } from "../../../test_helpers/sample_data";

describe("sortWbsByProperty", () => {
  it("sorts the wbs by the given property correctly (asc)", () => {
    const result = sortWbsByProperty(samplePerWbParameters, "n_strides");
    const resultIds = result.map((wb) => wb.wb_id);
    const expectedResultIds = [1, 0, 2, 4, 3]; // this is the id of the sorted order
    expect(resultIds).toEqual(expectedResultIds);
  });
});
