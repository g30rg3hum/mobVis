// TODO: test these functions

interface leastSquaresRegressionResults {
  slope: number;
  yIntercept: number;
  pearsonCorrelation: number;
}
export function leastSquaresRegression(
  xValues: number[],
  yValues: number[]
): leastSquaresRegressionResults {
  if (xValues.length !== yValues.length) {
    throw new Error("xValues and yValues should be the same length");
  }

  // compute the sum of xValues
  const sumXValues = sumValuesInArray(xValues);

  // compute the sum of yValues
  const sumYValues = sumValuesInArray(yValues);

  // compute the sum of x * y values.
  const XYValues = xValues.map((x, i) => x * yValues[i]);
  const sumXYValues = sumValuesInArray(XYValues);

  // compute the sum of x^2 values.
  const xSquaredValues = xValues.map((x) => x ** 2);
  const sumXSquaredValues = sumValuesInArray(xSquaredValues);

  // compute the slope of the line of best fit.
  const n = xValues.length;
  const slope =
    (n * sumXYValues - sumXValues * sumYValues) /
    (n * sumXSquaredValues - sumXValues ** 2);
  const yIntercept = (sumYValues - slope * sumXValues) / n;
  const pearsonCorrelation = calcPearsonCorrelation(xValues, yValues);

  return { slope, yIntercept, pearsonCorrelation };
}

export function calcPearsonCorrelation(xValues: number[], yValues: number[]) {
  if (xValues.length !== yValues.length) {
    throw new Error("xValues and yValues should be the same length");
  }

  const n = xValues.length;

  const sumXValues = sumValuesInArray(xValues);
  const sumXSquaredValues = sumValuesInArray(xValues.map((x) => x ** 2));
  const sumYValues = sumValuesInArray(yValues);
  const sumYSquaredValues = sumValuesInArray(yValues.map((y) => y ** 2));
  const sumXYValues = sumValuesInArray(xValues.map((x, i) => x * yValues[i]));

  const numerator = n * sumXYValues - sumXValues * sumYValues;
  const denominator = Math.sqrt(
    (n * sumXSquaredValues - sumXValues ** 2) *
      (n * sumYSquaredValues - sumYValues ** 2)
  );

  return numerator / denominator;
}

export function sumValuesInArray(values: number[]) {
  return values.reduce((acc, curr) => acc + curr, 0);
}
