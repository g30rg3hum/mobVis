"use client";
import { Margin } from "@/types/viz";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { roundToNDpIfNeeded } from "@/lib/utils";

export type HeatMapRecord = { x: string; y: string; value: number };

const colourRange = ["white", "#9B29FF"];

interface Props {
  width: number;
  height: number;
  margin: Margin;
  className?: string;
  xLabel: string;
  yLabel: string;
  data: HeatMapRecord[];
}
export default function HeatMap({
  width,
  height,
  margin,
  className,
  xLabel,
  yLabel,
  data,
}: Props) {
  const ref = useRef(null);
  const totalHeight = height + margin.top + margin.bottom;
  const totalWidth = width + margin.left + margin.right;

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

    // labels for rows and columns.
    // MAKE SURE TO KEEP THESE ATTRIBUTE VALUES CONSISTENT ACROSS DATA RECORDS.
    const xLabels = Array.from(new Set(data.map((d) => d.x)));
    const yLabels = Array.from(new Set(data.map((d) => d.y)));

    // create the x axis.
    const x = d3.scaleBand().range([0, width]).domain(xLabels).padding(0.01);
    const xAxis = d3.axisBottom(x);
    plot
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // create the y axis.
    const y = d3.scaleBand().range([height, 0]).domain(yLabels).padding(0.01);
    const yAxis = d3.axisLeft(y);
    plot.append("g").call(yAxis);

    // add axes labels
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

    const allValues = data.map((d) => d.value);
    const maxValue = Math.max(...allValues);
    // create colour scale
    const color = d3.scaleSequential([0, maxValue], ["white", "#9B29FF"]);

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

    plot
      .selectAll("cell")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.x)!)
      .attr("y", (d) => y(d.y)!)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", (d) => (d.value === 0 ? "blank" : color(d.value)))
      .on("mouseover", (event, d) => {
        tooltip
          .html(`${roundToNDpIfNeeded(d.value, 3)}`)
          .style("display", "block")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });

    // create the gradient def
    const grad = plot
      .append("defs")
      .append("linearGradient")
      .attr("id", "grad")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "100%")
      .attr("y2", "0%");

    // set up the actual gradient colour stops.
    grad
      .selectAll("colourStop")
      .data(colourRange)
      .enter()
      .append("stop")
      .style("stop-color", (color) => color)
      .attr("offset", (_, i) => 100 * (i / (colourRange.length - 1)) + "%");

    // add the gradient rect
    plot
      .append("rect")
      .attr("x", width + 30)
      .attr("y", 0)
      .attr("width", 35)
      .attr("height", height)
      .style("fill", "url(#grad)")
      .style("stroke", "black");

    // create the value range axis
    const valueRange = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([height, 0]);

    const valueAxis = d3.axisRight(valueRange).ticks(10);

    plot
      .append("g")
      .attr("transform", "translate(" + (width + 65) + ",0)")
      .call(valueAxis);
  }

  return (
    <svg width={width} height={height} ref={ref} className={className}></svg>
  );
}
