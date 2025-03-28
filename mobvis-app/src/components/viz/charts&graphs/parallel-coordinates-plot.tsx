"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Margin } from "@/types/viz";
import { Record } from "@/types/parameters";
import { colours } from "@/lib/utils";

interface Props {
  width: number;
  height: number;
  margin: Margin;
  className?: string;
  // groups of datasets.
  data: Record[][];
  // a subset of the fields from data to plot for as dimensions.
  axes: string[];
  axesLabelMap?: Map<string, string>;
}

interface Axis {
  name: string;
  position: number;
  scale: d3.ScaleLinear<number, number>;
}

export default function ParallelCoordinatesPlot({
  width,
  height,
  margin,
  className,
  data,
  axes,
  axesLabelMap,
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
      // get the min and max of data for this axis.
      let max: number;
      let min: number;
      data.forEach((group) => {
        group.forEach((record) => {
          const recordValue = record[axis];
          if (max === undefined || recordValue > max) {
            max = recordValue;
          }
          if (min === undefined || recordValue < min) {
            min = recordValue;
          }
        });
      });

      y[axis] = d3
        .scaleLinear()
        // domain is the min and max of data[axis]
        .domain([min! - 0.1 * min!, max! + 0.1 * max!])
        .range([height, 0]);
    });

    const x = d3.scalePoint().domain(axes).range([0, width]);

    const allAxes: Axis[] = axes.map((axis) => ({
      name: axis,
      position: x(axis)!,
      scale: y[axis],
    }));

    // draw axes
    const pcpAxisGroup = plot
      .selectAll("pcpAxis")
      .data(allAxes.map((axis) => axis.name))
      .enter()
      .append("g")
      .attr("class", "pcpAxis")
      // translate according to defined scalePoint
      .attr("transform", (axisName) => "translate(" + x(axisName) + ")")
      // for each axis draw the y axis.
      .each(function (axisName) {
        d3.select(this).call(d3.axisLeft(y[axisName]));
      });

    // add axis labels
    pcpAxisGroup
      .append("text")
      .text((axis) => axesLabelMap?.get(axis) ?? axis)
      .attr("y", height + 25)
      .style("text-anchor", "middle")
      .style("font-size", width / 75)
      .style("fill", "black");

    // draw the polylines for each record
    const recordToPath = (record: Record) => {
      const coordinates: [number, number][] = axes.map((axis) => [
        x(axis)!,
        y[axis](record[axis]),
      ]);
      return d3.line()(coordinates);
    };

    data.forEach((group, i) => {
      plot
        .selectAll("polyline")
        .data(group)
        .enter()
        .append("path")
        .attr("d", recordToPath)
        .style("fill", "none")
        .style("opacity", 0.5)
        .attr("stroke", colours[i])
        .attr("stroke-width", 2);
    });
  }
  return (
    <svg width={width} height={height} ref={ref} className={className}></svg>
  );
}
