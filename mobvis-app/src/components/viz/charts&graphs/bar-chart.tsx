"use client";
import { Margin } from "@/types/viz";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { colours, roundToNDpIfNeeded } from "@/lib/utils";

interface Props {
  width: number;
  height: number;
  margin: Margin;
  className: string;
  data: [string, number][];
  xLabel: string;
  yLabel: string;
  tiltXLabels?: boolean;
  differentColours?: number[][];
}
export default function BarChart({
  width,
  height,
  margin,
  className,
  data,
  xLabel,
  yLabel,
  tiltXLabels = false,
  differentColours,
}: Props) {
  const ref = useRef(null); // reference to SVG HTML element

  // set dimensions of graph
  const totalHeight = height + margin.top + margin.bottom;
  const totalWidth = width + margin.left + margin.right;

  // split up x and y values.
  const xValues = data.map((d) => d[0]);
  const yValues = data.map((d) => d[1]);

  useEffect(() => {
    draw();
  });

  function draw() {
    // get svg element and clear canvas
    const svg = d3.select(ref.current);
    svg.select("*").remove();

    // template for the main plot
    const plot = svg
      .attr("width", totalWidth)
      .attr("height", totalHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create the x axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((datapoint) => datapoint[0]))
      .padding(0.3); // spacing between bars
    const xAxis = d3.axisBottom(x);

    // limit x labels if there are too many
    if (xValues.length > 30) {
      xAxis.tickValues(x.domain().filter((_, i) => i % 5 === 0));
    }

    // draw the x axis
    const plottedXAxis = plot
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    if (tiltXLabels) {
      plottedXAxis
        .selectAll("text")
        .attr("transform", "translate(12,20)rotate(90)");
    }

    // create and draw the y axis
    const maxY = Math.max(...yValues);
    const y = d3
      .scaleLinear()
      .domain([0, maxY + maxY * 0.1])
      .range([height, 0]);
    const yAxis = d3.axisLeft(y);
    plot.append("g").call(yAxis);

    // add the x and y axis labels
    plot
      .append("text")
      .attr("y", height + 55)
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

    // define the tooltip to show when hovering over a bar
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

    // add the bars for each data point
    const bars = plot
      .selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d[0])!)
      .attr("y", (d) => y(d[1])!)
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d[1]))
      // hover data display functionality
      .on("mouseover", (event, d) => {
        tooltip
          .html(`(${d[0]}, ${roundToNDpIfNeeded(d[1], 3)})`)
          .style("display", "block")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });

    // set the different colorus for bars if specified
    if (differentColours) {
      bars.style("fill", (bar, i) => {
        for (let j = 0; j < differentColours.length; j++) {
          if (differentColours[j].includes(i)) {
            return colours[j];
          }
        }
        return "#000";
      });
    } else {
      bars.attr("fill", "#9B29FF");
    }
  }

  return (
    <svg width={width} height={height} ref={ref} className={className}></svg>
  );
}
