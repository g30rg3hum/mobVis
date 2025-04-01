"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Margin } from "@/types/viz";
import { Record } from "@/types/parameters";
import { colours } from "@/lib/utils";
import { Label } from "@/components/shadcn-components/label";
import { Input } from "@/components/shadcn-components/input";

interface Props {
  width: number;
  height: number;
  margin: Margin;
  className?: string;
  // groups of datasets.
  data: Record[][];
  // a subset of the fields from data to plot for as dimensions.
  axes: string[];
  identifyingFields?: string[];
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
  identifyingFields,
  axesLabelMap,
}: Props) {
  const [currentColor, setCurrentColor] = useState("#9B29FF");

  const ref = useRef(null);
  const totalHeight = height + margin.top + margin.bottom;
  const totalWidth = width + margin.left + margin.right;

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    axes,
    identifyingFields,
    axesLabelMap,
    width,
    height,
    margin,
    className,
  ]);

  // separate effect on colour change
  useEffect(() => {
    const svg = d3.select(ref.current);
    if (currentColor) {
      svg.selectAll("path").on("click", (event) => {
        d3.select(event.currentTarget).attr("stroke", currentColor);
      });
    }
  }, [currentColor]);

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

    data.forEach((group, i) => {
      const lines = plot
        .selectAll("polyline")
        .data(group)
        .enter()
        .append("path")
        .attr("d", recordToPath)
        .style("fill", "none")
        .style("opacity", 0.5)
        .attr("stroke", colours[i])
        .attr("stroke-width", 3);

      if (identifyingFields) {
        lines
          .on("mouseover", (event, d) => {
            const identifiers = identifyingFields.map(
              (identifyingField) => d[identifyingField]
            );
            tooltip
              .html(`${identifiers.join(",")}`)
              .style("display", "block")
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 20 + "px");
            d3.select(event.currentTarget).style("cursor", "pointer");
          })
          .on("mouseout", () => tooltip.style("display", "none"));
      }
    });
  }
  return (
    <>
      <div className="w-[100px]">
        <Label>Pick a colour</Label>
        <Input
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
        />
      </div>
      <svg width={width} height={height} ref={ref} className={className}></svg>
    </>
  );
}
