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
  additionalData?: [string, number][];
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
  additionalData,
  xLabel,
  yLabel,
  tiltXLabels = false,
  differentColours,
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

    // add the X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((datapoint) => datapoint[0]))
      .padding(0.3);
    const xAxis = d3.axisBottom(x);
    const plotXAxis = plot
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text");
    if (tiltXLabels) {
      plotXAxis.attr("transform", "translate(2,5)rotate(25)");
    }

    // add Y axis
    const maxY = Math.max(...yValues);
    const y = d3
      .scaleLinear()
      .domain([0, maxY + maxY * 0.25])
      .range([height, 0]);
    const yAxis = d3.axisLeft(y);
    plot.append("g").call(yAxis);

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

    // add the bars
    const bars = plot
      .selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d[0])!)
      .attr("y", (d) => y(d[1])!)
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d[1]))
      .on("mouseover", (event, d) => {
        tooltip
          .html(`${roundToNDpIfNeeded(d[1], 3)}`)
          .style("display", "block")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });

    if (additionalData) {
      bars
        .on("mouseover", (event, d) => {
          const hoverData = additionalData.find(
            (additionalD) => additionalD[0] === d[0]
          );
          if (hoverData) {
            tooltip
              .html(
                `${roundToNDpIfNeeded(d[1], 3)}, ${roundToNDpIfNeeded(
                  hoverData[1],
                  3
                )}`
              )
              .style("display", "block")
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 20 + "px");
          }
        })
        .on("mouseout", () => tooltip.style("display", "none"));
    }

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
