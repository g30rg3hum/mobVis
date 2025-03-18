import {
  calcPearsonCorrelation,
  leastSquaresRegression,
} from "@/lib/linearRegression";

describe("leastSquaresRegression", () => {
  it("calculates the slope and y-intercept correctly", () => {
    const xValues = [2, 3, 1, 3, 5];
    const yValues = [6, 1, 2, 5, 3];
    const result = leastSquaresRegression(xValues, yValues);
    expect(result.slope).toBeCloseTo(-0.06818);
    expect(result.yIntercept).toBeCloseTo(3.59091);
  });
});

describe("calcPearsonCorrelation", () => {
  it("calculates the pearson correlation correctly", () => {
    const xValues = [2, 3, 1, 3, 5];
    const yValues = [6, 1, 2, 5, 3];
    const result = calcPearsonCorrelation(xValues, yValues);
    expect(result).toBeCloseTo(-0.0488);
  });
});
