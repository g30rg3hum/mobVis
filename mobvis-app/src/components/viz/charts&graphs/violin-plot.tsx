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
  box?: boolean;
}

// TODO: clean out all the commented code.
export default function ViolinBoxPlot({
  width,
  height,
  margin,
  data,
  xLabel,
  yLabel,
  className,
  box = false,
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
    svg.select("*").remove();

    const plot = svg
      .attr("width", totalWidth)
      .attr("height", totalHeight)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the Y axis
    const maxY = Math.max(...yValues);
    const y = d3
      .scaleLinear()
      .domain([0, maxY + maxY * 0.5])
      .range([height, 0]);
    const yAxis = d3.axisLeft(y);
    plot.append("g").call(yAxis);

    plot
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", "-" + height / 2)
      .attr("y", "-45")
      .style("text-anchor", "middle")
      .text(yLabel)
      .attr("font-weight", 700);

    // add the X axis
    const x = d3.scaleBand().range([0, width]).domain(xValues).padding(0.25);
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

    const bins = d3
      .bin()
      .value((d: number) => d)
      .domain(y.domain() as [number, number])
      .thresholds(y.ticks(20));

    // group our data by x value.
    // [{x: string, binnedValues: }]
    const groupedData = d3.group(data, (d) => d[0]);

    const boxDataBasic = Array.from(groupedData, ([x, dataUnderX]) => {
      const allValues = dataUnderX.map((d) => d[1]);
      return { x, allValues };
    });
    // console.log(boxData);

    // update box data with additional required fields for plotting the boxplot
    const boxDataWhole = boxDataBasic.map((xGroup) => {
      const x = xGroup.x;
      const allValuesSorted = xGroup.allValues.sort(d3.ascending);
      const q1 = d3.quantile(allValuesSorted, 0.25)!;
      const median = d3.quantile(allValuesSorted, 0.5)!;
      const q3 = d3.quantile(allValuesSorted, 0.75)!;
      const interquartileRange = q3 - q1;
      const minWhisker = Math.min(...allValuesSorted);
      const maxWhisker = Math.max(...allValuesSorted);

      return {
        x,
        allValuesSorted,
        q1,
        median,
        q3,
        interquartileRange,
        minWhisker,
        maxWhisker,
      };
    });

    // console.log(groupedData);
    // console.log("groupedData", groupedData);
    // console.log("groupedData[1]", groupedData.get("1"));

    // FOR VIOLIN PLOT
    // array of {x, binnedValues}
    // x being the group
    const binnedData = Array.from(groupedData, ([x, dataUnderX]) => {
      const yValues = dataUnderX.map((v) => v[1]);
      // all the y values put into bins
      // the length of this determines width of violin
      // x0 and x1 are the LB and UB of the bin, cutpoints.
      const binnedValues = bins(yValues);

      // console.log(binnedValues);
      // console.log(binnedValues.map((d) => d.length));
      // const binnedValuesIntervals = binnedValues.map(
      //   (d) => [d.x0!, d.x1!] as [number, number]
      // );
      // const binnedValuesRaw = binnedValues.map((d) => d.slice());
      // // these are to be plotted with the area
      // const binnedValuesX0X1 = binnedValues.map((d) => {
      //   // get the number of raw values in the bin.
      //   const length = d.slice().length;
      //   return [xScale(-length), xScale(length)] as [number, number];
      // });
      // console.log("binnedValues:", binnedValues);
      // console.log("binnedValues actual values", binnedValues[0].slice());
      // console.log("binnedValues x0:", binnedValues[0].x0);
      // console.log("binnedValues x1:", binnedValues[0].x1);
      return { x, binnedValues };
    });
    // console.log("groupedData", groupedData);
    // console.log("binnedData", binnedData);
    // console.log(binnedData);

    // use the max bin length for the domain
    const maxBinLength =
      d3.max(binnedData, (data) =>
        d3.max(data.binnedValues, (binnedValues) => binnedValues.length)
      ) ?? 0;
    // scale for each violin
    const xScale = d3
      .scaleLinear()
      // the actual width of the violin.
      .range([0, x.bandwidth()])
      .domain([-maxBinLength, maxBinLength]);

    // FOR VIOLIN PLOT
    if (!box) {
      plot
        .selectAll("violin")
        .data(binnedData)
        .enter()
        .append("g")
        .style("fill", (data, i) => colours[i])
        // move the group violin forward.
        .attr("transform", (d) => "translate(" + x(d.x) + ", 0)")
        .append("path")
        // get the binned values for this x.
        .datum((d) => d.binnedValues)
        .style("stroke", "none")
        .attr(
          "d",
          d3
            .area<d3.Bin<number, number>>()
            .x0((d) => xScale(-d.length))
            .x1((d) => xScale(d.length))
            // plot in the middle of the bin, because its in the middle of the bin, not necessarily at the max/min value.
            .y((d) => y((d.x0! + d.x1!) / 2))
            .curve(d3.curveCatmullRom)
        );
    }

    // FOR BOX PLOT
    if (box) {
      // drawing the main vertical line
      plot
        .selectAll("boxVerticalLine")
        .data(boxDataWhole)
        .enter()
        .append("g")
        .attr(
          "transform",
          (d) => "translate(" + (x(d.x)! + x.bandwidth() / 2) + ", 0)"
        )
        .append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", (d) => y(d.maxWhisker))
        .attr("y2", (d) => y(d.minWhisker))
        .attr("stroke", "black")
        .attr("stroke-width", 2);

      // draw the box
      const boxWidth = x.bandwidth() / 2;
      plot
        .selectAll("boxRect")
        .data(boxDataWhole)
        .enter()
        .append("rect")
        .attr(
          "transform",
          (d) => "translate(" + (x(d.x)! + x.bandwidth() / 2) + ", 0)"
        )
        // because already at the center, need to go bakcwrads.
        .attr("x", -boxWidth / 2)
        .attr("y", (d) => y(d.q3))
        .attr("height", (d) => y(d.q1) - y(d.q3))
        .attr("width", boxWidth)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .style("fill", (d, i) => colours[i]);

      // draw the max
      plot
        .selectAll("boxHorizontalLine")
        .data(boxDataWhole)
        .enter()
        .append("line")
        .attr(
          "transform",
          (d) => "translate(" + (x(d.x)! + x.bandwidth() / 2) + ", 0)"
        )
        .attr("x1", -boxWidth / 2)
        .attr("x2", boxWidth / 2)
        .attr("y1", (d) => y(d.maxWhisker))
        .attr("y2", (d) => y(d.maxWhisker))
        .attr("stroke", "black")
        .attr("stroke-width", 2);

      // draw the min
      plot
        .selectAll("boxHorizontalLine")
        .data(boxDataWhole)
        .enter()
        .append("line")
        .attr(
          "transform",
          (d) => "translate(" + (x(d.x)! + x.bandwidth() / 2) + ", 0)"
        )
        .attr("x1", -boxWidth / 2)
        .attr("x2", boxWidth / 2)
        .attr("y1", (d) => y(d.minWhisker))
        .attr("y2", (d) => y(d.minWhisker))
        .attr("stroke", "black")
        .attr("stroke-width", 2);

      // draw the median
      plot
        .selectAll("boxHorizontalLine")
        .data(boxDataWhole)
        .enter()
        .append("line")
        .attr(
          "transform",
          (d) => "translate(" + (x(d.x)! + x.bandwidth() / 2) + ", 0)"
        )
        .attr("x1", -boxWidth / 2)
        .attr("x2", boxWidth / 2)
        .attr("y1", (d) => y(d.median))
        .attr("y2", (d) => y(d.median))
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    }
  }

  return (
    <svg width={width} height={height} ref={ref} className={className}></svg>
  );
}
