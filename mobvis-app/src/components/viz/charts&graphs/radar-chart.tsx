"use client";

import { colours } from "@/lib/utils";
import { Record } from "@/types/parameters";
import { Margin } from "@/types/viz";
import * as d3 from "d3";
import { useRef, useEffect } from "react";

interface Props {
  width: number;
  height: number;
  radius: number;
  margin: Margin;
  data: Record[];
  // indices of records to plot shapes for
  recordsToPlot: number[];
  axes: string[];
  className?: string;
}
export default function RadarChart({
  width,
  height,
  margin,
  radius,
  data,
  recordsToPlot,
  axes,
  className,
}: Props) {
  const ref = useRef(null);
  const totalHeight = height + margin.top + margin.bottom;
  const totalWidth = width + margin.left + margin.right;

  useEffect(() => {
    draw();
  });

  function draw() {
    const svg = d3.select(ref.current);
    // clean slate.
    svg.selectAll("*").remove();

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
        .domain([min - 0.1 * min, max + 0.1 * max])
        .range([0, radius]);
    });

    // draw big outer circle
    plot
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("r", radius)
      .attr("opacity", 0.1);

    // draw the axes
    plot
      .selectAll("axis")
      .data(axes)
      .enter()
      .append("g")
      .each(function (axis, i) {
        // create the axis
        const d3Axis = d3.axisRight(y[axis]);
        d3.select(this).call(d3Axis);

        // manipulate the ticks before rotating whole axis
        const angle = (360 / axes.length) * i;
        d3.select(this)
          .selectAll(".tick text")
          .attr("transform", `rotate(${-angle})`)
          .style("text-anchor", "start");

        // move ticks to the center of the axis
        d3.select(this)
          .selectAll(".tick line")
          .attr("transform", "translate(-3,0)");

        // remove the first tick
        d3.select(this)
          .selectAll(".tick")
          .filter((_, i) => i === 0)
          .remove();

        d3.select(this)
          .append("text")
          .attr("text-anchor", "middle")
          .style("fill", "black")
          .style("font-weight", 600)
          .style("font-size", "0.8rem")
          .attr("transform", `translate(0, ${radius + 25}) rotate(${-angle})`)
          .text(axis);
      })
      // rotate the axis around the circle
      .attr("transform", (_, i) => {
        const angle = (360 / axes.length) * i;
        return `translate(${width / 2}, ${height / 2}) rotate(${angle})`;
      });

    // plot the shapes for selected records
    recordsToPlot.forEach((index, order) => {
      const colour = colours[order % colours.length];
      const record = data[index];

      // compute the coordinates for each point on the axis
      // for this record.
      const coordinates = axes.map((axis, i) => {
        const correspondingAxis = y[axis];
        const recordAxisValue = record[axis];
        const pointOnAxis = correspondingAxis(recordAxisValue);
        const angleInDeg = (360 / axes.length) * i;
        const angleInRad = (angleInDeg * Math.PI) / 180;

        // rotate the pointOnaxis by angleInRad
        const newX: number =
          -1 * pointOnAxis * Math.sin(angleInRad) + width / 2;
        const newY: number = pointOnAxis * Math.cos(angleInRad) + height / 2;
        return [newX, newY];
      });

      // duplicate first coordinate to close shape
      coordinates.push(coordinates[0]);

      // connect dots and plot shape
      plot
        .append("path")
        .datum(coordinates)
        .attr("stroke", colour)
        .attr("stroke-width", 2)
        .attr("fill", colour)
        .attr("opacity", 0.4)
        .attr("d", d3.line());

      // plot the points
      plot
        .selectAll("shapePoint")
        .data(coordinates)
        .enter()
        .append("circle")
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1])
        .attr("r", 3)
        .style("fill", colour);
    });
  }

  return (
    <svg width={width} height={height} ref={ref} className={className}></svg>
  );
}
