"use client";

import { Margin } from "@/types/viz";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { colours } from "@/lib/utils";

interface Props {
  width: number;
  height: number;
  margin: Margin;
  data: [string, number][];
  xLabel: string;
  yLabel: string;
  className?: string;
  binSize?: number;
}
export default function Histogram({
  width,
  height,
  margin,
  data,
  xLabel,
  yLabel,
  className,
  binSize = 20,
}: Props) {
  const ref = useRef(null);
  const totalHeight = height + margin.top + margin.bottom;
  const totalWidth = width + margin.left + margin.right;
  // const xValues = data.map((d) => d[0]);
  const yValues = data.map((d) => d[1]);

  useEffect(() => {
    draw();
  });

  function draw() {
    const svg = d3.select(ref.current);
    svg.select("*").remove();

    const plot = svg
      .attr("width", totalWidth)
      .attr("height", totalHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the X axis -> these are the values of the variable.
    const maxY = Math.max(...yValues);
    const x = d3
      .scaleLinear()
      .domain([0, maxY + maxY * 0.25])
      .range([0, width]);
    const xAxis = d3.axisBottom(x);
    plot
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // X axis label.
    plot
      .append("text")
      .attr("y", height + 45)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .attr("font-weight", 700)
      .text(xLabel);

    // set up the bins for the histogram
    const bins = d3
      .bin()
      .value((d: number) => d)
      .domain(x.domain() as [number, number])
      .thresholds(x.ticks(binSize));

    const groupedData = d3.group(data, (d) => d[0]);
    const binnedData = Array.from(groupedData, ([x, dataUnderX]) => {
      const values = dataUnderX.map((v) => v[1]);
      const binnedValues = bins(values);
      return { x, binnedValues };
    });

    // create the y axis
    const y = d3.scaleLinear().range([height, 0]);

    // need the max count in  abin
    const maxBinLength =
      d3.max(binnedData, (data) =>
        d3.max(data.binnedValues, (binnedValues) => binnedValues.length)
      ) ?? 0;
    y.domain([0, maxBinLength]);
    const yAxis = d3.axisLeft(y);
    yAxis.tickValues(y.ticks().filter((t) => Number.isInteger(t)));
    plot.append("g").call(yAxis);

    // label the y axis
    plot
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", "-" + height / 2)
      .attr("y", "-40")
      .style("text-anchor", "middle")
      .text(yLabel)
      .attr("font-weight", 700);

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("display", "none")
      .style("background", "black")
      .style("color", "white")
      .style("padding", "6px 10px")
      .style("border-radius", "6px")
      .style("font-size", "20px");

    // draw the bars
    plot
      .selectAll("histogramGroup")
      .data(binnedData)
      .enter()
      .append("g")
      .style("fill", (d, i) => colours[i])
      .selectAll("histogramBar")
      .data((d) => d.binnedValues)
      .enter()
      .append("rect")
      // create a small gap between the rects.
      .attr("x", 1)
      .attr(
        "transform",
        // start from the lower bound of bin.
        // translate to the top left corner of where the rect is supposed to be.
        (d) => "translate(" + x(d.x0!) + "," + y(d.length) + ")"
      )
      // width of the bin, - 1 to account for the gap.
      .attr("width", (d) => x(d.x1!) - x(d.x0!) - 1)
      // height from top of the bar to the bottom of the chart.
      .attr("height", (d) => height - y(d.length))
      .attr("opacity", 0.65)
      .on("mouseover", (event, d) => {
        tooltip
          .html(`${d.x0} - ${d.x1}: ${d.length}`)
          .style("display", "block")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });
  }

  return (
    <svg width={width} height={height} ref={ref} className={className}></svg>
  );
}
