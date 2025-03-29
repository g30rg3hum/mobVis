import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/table";
import { refinedParamNames } from "@/lib/fields";
import { roundToNDpIfNeeded } from "@/lib/utils";
import { AggregateParameters } from "@/types/parameters";
import { useState } from "react";

interface Props {
  allAggregateParameters: AggregateParameters;
}
export default function TableOfAggregateParameters({
  allAggregateParameters,
}: Props) {
  const [displayedAggregateParameters, setDisplayedAggregateParameters] =
    useState<AggregateParameters>(allAggregateParameters);

  // dragging and swapping rows
  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    e.dataTransfer?.setData("index", index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLTableRowElement>,
    index: number
  ) => {
    // swap positions
    const draggedIndex = Number(e.dataTransfer?.getData("index"));
    const draggedParameter = displayedAggregateParameters.find(
      (_, i) => i === draggedIndex
    );

    const swapParameter = displayedAggregateParameters.find(
      (_, i) => i == index
    );
    const draggedParameterIndex = displayedAggregateParameters.indexOf(
      draggedParameter!
    );
    const swapParameterIndex = displayedAggregateParameters.indexOf(
      swapParameter!
    );
    const newAggregateParameters = [...displayedAggregateParameters];
    newAggregateParameters[draggedParameterIndex] = swapParameter!;
    newAggregateParameters[swapParameterIndex] = draggedParameter!;

    setDisplayedAggregateParameters(newAggregateParameters);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Parameter</TableHead>
          <TableHead>Average</TableHead>
          <TableHead>Maximum</TableHead>
          <TableHead>Minimum</TableHead>
          <TableHead>Variance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayedAggregateParameters.map((param, i) => (
          <TableRow
            key={param.param}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
          >
            <TableCell>
              {refinedParamNames.get(param.param) ?? param.param}
            </TableCell>
            <TableCell>{roundToNDpIfNeeded(param.avg, 5)}</TableCell>
            <TableCell>{roundToNDpIfNeeded(param.max, 5)}</TableCell>
            <TableCell>{roundToNDpIfNeeded(param.min, 5)}</TableCell>
            <TableCell>{roundToNDpIfNeeded(param.var, 5)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
