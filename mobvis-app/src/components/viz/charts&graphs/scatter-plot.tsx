"use client";

import { leastSquaresRegression } from "@/lib/linearRegression";
import { roundToNDpIfNeeded } from "@/lib/utils";
import { Margin } from "@/types/viz";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface Props {
  width: number;
  height: number;
  margin: Margin;
  data: [number, number][];
  xLabel: string;
  yLabel: string;
  type: "connected" | "step" | "correlation";
  integralX?: boolean;
  className: string;
}
export default function ScatterPlot({
  width,
  height,
  margin,
  data,
  xLabel,
  yLabel,
  type = "connected",
  integralX = false,
  className,
}: Props) {
  const ref = useRef(null);
  const totalHeight = height + margin.top + margin.bottom;
  const totalWidth = width + margin.left + margin.right;
  const xValues = data.map((d) => d[0]);
  const yValues = data.map((d) => d[1]);

  useEffect(() => {
    draw();
  });

  function draw() {
    const svg = d3.select(ref.current);
    // clean the slate
    svg.selectAll("*").remove();

    const plot = svg
      // establish h and w, and create a group for the actual plot
      .attr("width", totalWidth)
      .attr("height", totalHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the X axis
    const maxX = Math.max(...xValues);
    const endX = maxX + maxX * 0.1;
    const integralTicks = d3.range(0, maxX + 1, 1);
    const x = d3.scaleLinear().domain([0, endX]).range([0, width]);

    const xAxis = d3.axisBottom(x);

    if (integralX) {
      xAxis.tickValues(integralTicks).tickFormat(d3.format("d"));
    }

    // push it all the way down
    plot
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // add the Y axis
    const maxY = Math.max(...yValues);
    const y = d3
      .scaleLinear()
      .domain([0, maxY + maxY * 0.5])
      .range([height, 0]);
    plot.append("g").call(d3.axisLeft(y));

    // add the axis labels
    plot
      .append("text")
      .attr("y", height + 45)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .attr("font-weight", 700)
      .text(xLabel);

    plot
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", "-" + height / 2)
      .attr("y", "-45")
      .style("text-anchor", "middle")
      .text(yLabel)
      .attr("font-weight", 700);

    // plot the data
    plot
      .append("g")
      .selectAll("point")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d[0]))
      .attr("cy", (d) => y(d[1]))
      .attr("r", 4)
      .style("fill", "#9B29FF");

    function connectPointsLine(): d3.Line<[number, number]> {
      if (type === "connected") {
        return d3
          .line()
          .x((d) => x(d[0]))
          .y((d) => y(d[1]));
      } else if (type === "step") {
        return d3
          .line()
          .x((d) => x(d[0]))
          .y((d) => y(d[1]))
          .curve(d3.curveStep);
      }
      return d3.line();
    }

    if (type === "connected" || type === "step") {
      plot
        .append("path")
        .datum(data)
        .attr("stroke", "#9B29FF")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("d", connectPointsLine());
    }

    if (type === "correlation") {
      // calculate least squares regression
      const result = leastSquaresRegression(xValues, yValues);

      const lineOfBestFit = (x: number): number =>
        result.slope * x + result.yIntercept;
      const lineOfBestFitPoints: [number, number][] = [
        [0, lineOfBestFit(0)],
        [endX, lineOfBestFit(endX)],
      ];
      const plottedLOB = plot
        .append("path")
        .datum(lineOfBestFitPoints)
        .attr("stroke", "#9B29FF")
        .attr("stroke-width", 3)
        .style("fill", "none")
        .attr(
          "d",
          d3
            .line()
            .x((d) => x(d[0]))
            .y((d) => y(d[1]))
        );

      // create the tooltip for correlation coefficient
      const tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "visible")
        .html(
          `<b>Pearson correlation coefficient:</b> ${roundToNDpIfNeeded(
            result.pearsonCorrelation,
            5
          )}`
        )
        .style("font-size", 50);

      plottedLOB
        .on("mouseover", (event) =>
          tooltip
            .style("visibility", "visible")
            .style("left", event.pageX + "px")
            .style("top", event.pageY + 20 + "px")
        )
        .on("mouseout", () => tooltip.style("visibility", "hidden"));
    }
  }

  return (
    <svg width={width} height={height} ref={ref} className={className}></svg>
  );
}
