import {
  groupPerStrideParametersByWbId,
  sortStridesByProperty,
  sortWbsByProperty,
  splitPerStrideParametersIntoLAndR,
} from "@/lib/utils";
import {
  samplePerStrideParameters,
  samplePerWbParameters,
} from "../../../test_helpers/sample_data";

describe("sortWbsByProperty", () => {
  it("sorts the wbs by the n_strides correctly (asc)", () => {
    const result = sortWbsByProperty(samplePerWbParameters, "n_strides");
    const resultIds = result.map((wb) => wb.wb_id);
    const expectedResultIds = [1, 0, 2, 4, 3]; // this is the id of the sorted order
    expect(resultIds).toEqual(expectedResultIds);
  });
});

describe("groupPerStrideParametersByWbId", () => {
  it("groups the per stride parameters by wb_id correctly", () => {
    const result = groupPerStrideParametersByWbId(samplePerStrideParameters);
    const stridesWithWbId0 = result.get(0);
    expect(stridesWithWbId0).toHaveLength(12);
    const stridesWithWbId1 = result.get(1);
    expect(stridesWithWbId1).toHaveLength(8);
    const stridesWithWbId2 = result.get(2);
    expect(stridesWithWbId2).toHaveLength(12);
  });
});

describe("sortStridesByProperty", () => {
  it("sorts the strides by stride_duration_s (asc)", () => {
    const result = sortStridesByProperty(
      samplePerStrideParameters.slice(0, 5), // just take 5 of them
      "stride_duration_s"
    );
    const resultIds = result.map((stride) => [stride.wb_id, stride.s_id]);
    const expectedResultIds = [
      [0, 0],
      [0, 3],
      [0, 4],
      [0, 1],
      [0, 2],
    ]; // this is the id of the sorted order
    expect(resultIds).toEqual(expectedResultIds);
  });

  it("sorts the strides by left/right label (asc - left should come first)", () => {
    const result = sortStridesByProperty(
      samplePerStrideParameters.slice(0, 5), // just take 5 of them
      "lr_label"
    );

    // the first three should be left
    expect(result[0].lr_label).toBe("left");
    expect(result[1].lr_label).toBe("left");
    expect(result[2].lr_label).toBe("left");
    // then the last 2 should be right
    expect(result[3].lr_label).toBe("right");
    expect(result[4].lr_label).toBe("right");
  });
});

describe("splitPerStrideParametersIntoLAndR", () => {
  it("splits the strides into left and right correctly", () => {
    const result = splitPerStrideParametersIntoLAndR(
      samplePerStrideParameters.slice(0, 5)
    );
    const leftStrides = result[0];
    const rightStrides = result[1];

    expect(leftStrides).toEqual([0, 1, 3]);
    expect(rightStrides).toEqual([2, 4]);
  });
});
