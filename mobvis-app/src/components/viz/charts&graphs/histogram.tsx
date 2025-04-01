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
  sortBinnedData?: boolean;
}
export default function Histogram({
  width,
  height,
  margin,
  data,
  xLabel,
  yLabel,
  className,
  sortBinnedData = false,
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
    const x = d3.scaleLinear().domain([0, maxY]).range([0, width]);
    const xAxis = d3.axisBottom(x);
    plot
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

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
      .thresholds(x.ticks(50));

    const groupedData = d3.group(data, (d) => d[0]);

    const binnedData = Array.from(groupedData, ([x, dataUnderX]) => {
      const values = dataUnderX.map((v) => v[1]);
      const binnedValues = bins(values);
      return { x, binnedValues };
    });

    if (sortBinnedData) binnedData.sort((a, b) => d3.ascending(a.x, b.x));
    // console.log(binnedData);

    // create the y axis
    const y = d3.scaleLinear().range([height, 0]);

    // need the max count in  abin
    const maxBinLength =
      d3.max(binnedData, (data) =>
        d3.max(data.binnedValues, (binnedValues) => binnedValues.length)
      ) ?? 0;

    y.domain([0, maxBinLength]);
    const yAxis = d3.axisLeft(y);
    // frequency are just integers.
    const integralTicks = d3.range(0, maxBinLength + 1, 1);
    yAxis.tickValues(integralTicks).tickFormat(d3.format("d"));
    plot.append("g").call(yAxis);

    plot
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", "-" + height / 2)
      .attr("y", "-45")
      .style("text-anchor", "middle")
      .text(yLabel)
      .attr("font-weight", 700);

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
      .attr("opacity", 0.75);
  }

  return (
    <svg width={width} height={height} ref={ref} className={className}></svg>
  );
}
