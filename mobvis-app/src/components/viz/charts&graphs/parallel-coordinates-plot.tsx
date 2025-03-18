"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Margin } from "@/types/viz";
import { Record } from "@/types/parameters";

interface Props {
  width: number;
  height: number;
  margin: Margin;
  className?: string;
  // array of custom data objects
  data: Record[];
  // a subset of the fields from data to plot for as dimensions.
  axes: string[];
}

export default function ParallelCoordinatesPlot({
  width,
  height,
  margin,
  className,
  data,
  axes,
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

    // build a linear scale for each axis
    const y: { [key: string]: d3.ScaleLinear<number, number> } = {};
    axes.forEach((axis) => {
      const dataForAxis = data.map((d) => d[axis]);
      const max = Math.max(...dataForAxis);
      const min = Math.min(...dataForAxis);

      y[axis] = d3
        .scaleLinear()
        // domain is the min and max of data[axis]
        .domain([min - 0.1 * min, max + 0.1 * max])
        .range([height, 0]);
    });

    const x = d3.scalePoint().domain(axes).range([0, width]);

    // draw axes
    plot
      .selectAll("axis")
      .data(axes)
      .enter()
      .append("g")
      // translate according to defined scalePoint
      .attr("transform", (axis) => "translate(" + x(axis) + ")")
      // for each axis draw the y axis.
      .each(function (axis) {
        d3.select(this).call(d3.axisLeft(y[axis]));
      })
      // add axis label
      .append("text")
      .text((axis) => axis)
      .attr("y", height + 25)
      .style("text-anchor", "middle")
      .style("fill", "black");

    // draw the polylines for each record
    const recordToPath = (record: Record) => {
      const coordinates: [number, number][] = axes.map((axis) => [
        x(axis)!,
        y[axis](record[axis]),
      ]);
      return d3.line()(coordinates);
    };

    plot
      .selectAll("polyline")
      .data(data)
      .enter()
      .append("path")
      .attr("d", recordToPath)
      .style("fill", "none")
      .style("opacity", 0.5)
      .attr("stroke", "#9B29FF")
      .attr("stroke-width", 2);
  }
  return (
    <svg width={width} height={height} ref={ref} className={className}></svg>
  );
}
