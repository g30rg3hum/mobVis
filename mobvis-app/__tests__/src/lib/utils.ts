import {
  createDatasetOfKeyAndValTuples,
  createPerStrideDatasetForHeatmap,
  createPerStrideDatasetWithDesiredWbIds,
  groupPerStrideParametersByWbId,
  sortStridesByProperty,
  sortWbsByProperty,
  splitPerStrideParametersIntoLAndRIndicesArray,
} from "@/lib/utils";
import {
  samplePerStrideParameters,
  samplePerWbParameters,
} from "../../../test_helpers/sample_data";
import { PerStrideParameters } from "@/types/parameters";

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
    const result = splitPerStrideParametersIntoLAndRIndicesArray(
      samplePerStrideParameters.slice(0, 5)
    );
    const leftStrides = result[0];
    const rightStrides = result[1];

    expect(leftStrides).toEqual([0, 1, 3]);
    expect(rightStrides).toEqual([2, 4]);
  });
});

describe("createDatasetOfKeyAndTuples", () => {
  it("creates dataset of [wbId, val][] correctly (typical/regular case)", () => {
    const currentWbIds = [0, 1];
    const focusParam = "walking_speed_mps";
    const groupedPerStrideParameters = new Map<number, PerStrideParameters>([
      [0, samplePerStrideParameters.slice(0, 2)],
      [1, samplePerStrideParameters.slice(2, 4)],
    ]);

    const result = createDatasetOfKeyAndValTuples(
      currentWbIds,
      focusParam,
      groupedPerStrideParameters
    );
    const stride0ParamValue = samplePerStrideParameters[0].walking_speed_mps;
    const stride1ParamValue = samplePerStrideParameters[1].walking_speed_mps;
    const stride2ParamValue = samplePerStrideParameters[2].walking_speed_mps;
    const stride3ParamValue = samplePerStrideParameters[3].walking_speed_mps;

    const expectedResult = [
      ["0", stride0ParamValue],
      ["0", stride1ParamValue],
      ["1", stride2ParamValue],
      ["1", stride3ParamValue],
    ];

    expect(result).toEqual(expectedResult);
  });

  it("throws an error if no. of wbIds is not 1 and split into left and right is set to true", () => {
    const currentWbIds = [0, 1];
    const focusParam = "walking_speed_mps";
    const groupedPerStrideParameters = new Map<number, PerStrideParameters>([
      [0, samplePerStrideParameters.slice(0, 2)],
      [1, samplePerStrideParameters.slice(2, 4)],
    ]);

    expect(() =>
      createDatasetOfKeyAndValTuples(
        currentWbIds,
        focusParam,
        groupedPerStrideParameters,
        true
      )
    ).toThrow("Can only split left and right strides if only 1 wbId");
  });

  it("splits the strides into left and right correctly", () => {
    const currentWbIds = [0];
    const focusParam = "walking_speed_mps";
    const groupedPerStrideParameters = new Map<number, PerStrideParameters>([
      [0, samplePerStrideParameters.slice(0, 5)],
    ]);

    const result = createDatasetOfKeyAndValTuples(
      currentWbIds,
      focusParam,
      groupedPerStrideParameters,
      true
    );

    const stride0LR = samplePerStrideParameters[0].lr_label;
    const stride1LR = samplePerStrideParameters[1].lr_label;
    const stride2LR = samplePerStrideParameters[2].lr_label;
    const stride3LR = samplePerStrideParameters[3].lr_label;
    const stride4LR = samplePerStrideParameters[4].lr_label;

    const stride0ParamValue = samplePerStrideParameters[0].walking_speed_mps;
    const stride1ParamValue = samplePerStrideParameters[1].walking_speed_mps;
    const stride2ParamValue = samplePerStrideParameters[2].walking_speed_mps;
    const stride3ParamValue = samplePerStrideParameters[3].walking_speed_mps;
    const stride4ParamValue = samplePerStrideParameters[4].walking_speed_mps;

    const expectedResult = [
      [stride0LR, stride0ParamValue],
      [stride1LR, stride1ParamValue],
      [stride2LR, stride2ParamValue],
      [stride3LR, stride3ParamValue],
      [stride4LR, stride4ParamValue],
    ];

    expect(result).toEqual(expectedResult);
  });
});

describe("createPerStrideDatasetWithDesiredWbIds", () => {
  it("creates groups of PerStrideParameters correctly (regular case)", () => {
    const currentWbIds = [0, 1];
    const groupedPerStrideParameters = new Map<number, PerStrideParameters>([
      [0, samplePerStrideParameters.slice(0, 2)],
      [1, samplePerStrideParameters.slice(2, 4)],
    ]);

    const result = createPerStrideDatasetWithDesiredWbIds(
      currentWbIds,
      groupedPerStrideParameters
    );

    const expectedResult = [
      samplePerStrideParameters.slice(0, 2),
      samplePerStrideParameters.slice(2, 4),
    ];

    expect(result).toEqual(expectedResult);
  });

  it("throws an error if no. of wbIds is not 1 and split into left and right is set to true", () => {
    const currentWbIds = [0, 1];
    const groupedPerStrideParameters = new Map<number, PerStrideParameters>([
      [0, samplePerStrideParameters.slice(0, 2)],
      [1, samplePerStrideParameters.slice(2, 4)],
    ]);

    expect(() =>
      createPerStrideDatasetWithDesiredWbIds(
        currentWbIds,
        groupedPerStrideParameters,
        true
      )
    ).toThrow("Can only split left and right strides if only 1 wbId");
  });

  it("splits the strides into left and right correctly", () => {
    const currentWbIds = [0];
    const sampleStrideRecords = samplePerStrideParameters.slice(0, 5);
    const groupedPerStrideParameters = new Map<number, PerStrideParameters>([
      [0, sampleStrideRecords],
    ]);

    const result = createPerStrideDatasetWithDesiredWbIds(
      currentWbIds,
      groupedPerStrideParameters,
      true
    );

    const expectedResult = [];
    expectedResult[0] = sampleStrideRecords.filter(
      (stride) => stride.lr_label === "left"
    );
    expectedResult[1] = sampleStrideRecords.filter(
      (stride) => stride.lr_label === "right"
    );

    expect(result).toEqual(expectedResult);
  });
});

describe("createPerStrideDatasetForHeatmap", () => {
  it("successfully creates the dataset for a heatmap with blank padded records", () => {
    const currentWbIds = [0, 1, 2];
    const groupedPerStrideParameters = new Map<number, PerStrideParameters>([
      [0, samplePerStrideParameters.slice(0, 3)],
      [1, samplePerStrideParameters.slice(3, 4)],
      [2, samplePerStrideParameters.slice(4, 8)],
      // samples 0-7
    ]);

    // all wbs are relevant.
    // const maxStridesInWb = 4;
    const focusParam = "walking_speed_mps";

    const result = createPerStrideDatasetForHeatmap(
      groupedPerStrideParameters,
      currentWbIds,
      focusParam
    );

    const stride0ParamValue = samplePerStrideParameters[0].walking_speed_mps;
    const stride1ParamValue = samplePerStrideParameters[1].walking_speed_mps;
    const stride2ParamValue = samplePerStrideParameters[2].walking_speed_mps;
    const stride3ParamValue = samplePerStrideParameters[3].walking_speed_mps;
    const stride4ParamValue = samplePerStrideParameters[4].walking_speed_mps;
    const stride5ParamValue = samplePerStrideParameters[5].walking_speed_mps;
    const stride6ParamValue = samplePerStrideParameters[6].walking_speed_mps;
    const stride7ParamValue = samplePerStrideParameters[7].walking_speed_mps;

    const expectedResult = [
      { x: "1", y: "0", value: stride0ParamValue },
      { x: "2", y: "0", value: stride1ParamValue },
      { x: "3", y: "0", value: stride2ParamValue },
      { x: "4", y: "0", value: 0 }, // blank padding
      { x: "1", y: "1", value: stride3ParamValue },
      { x: "2", y: "1", value: 0 },
      { x: "3", y: "1", value: 0 },
      { x: "4", y: "1", value: 0 },
      { x: "1", y: "2", value: stride4ParamValue },
      { x: "2", y: "2", value: stride5ParamValue },
      { x: "3", y: "2", value: stride6ParamValue },
      { x: "4", y: "2", value: stride7ParamValue },
    ];

    expect(result).toEqual(expectedResult);
  });
});
