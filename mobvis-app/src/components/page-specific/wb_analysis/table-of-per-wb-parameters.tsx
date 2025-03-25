"use client";
import { Input } from "@/components/shadcn-components/input";
import { Label } from "@/components/shadcn-components/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/table";
import {
  divideThenRoundUpToInt,
  roundToNDpIfNeeded,
  sortWbsByProperty,
} from "@/lib/utils";
import {
  PerWbDataField,
  PerWbParameter,
  PerWbParameters,
} from "@/types/parameters";
import { useState } from "react";
import SortIcon from "../analyses/sort-icon";
import { Button } from "@/components/shadcn-components/button";

interface Props {
  allPerWbParameters: PerWbParameters;
}
export default function TableOfPerWbParameters({ allPerWbParameters }: Props) {
  const [displayedWbParameters, setDisplayedWbParameters] =
    useState<PerWbParameters>(allPerWbParameters);

  // need to store the previous sort state for each column
  const [sortIdAsc, setSortIdAsc] = useState<boolean>(true);
  const [sortNStridesAsc, setSortNStridesAsc] = useState<boolean>(false);
  const [sortDurationAsc, setSortDurationAsc] = useState<boolean>(false);
  const [sortStrideDurationAsc, setSortStrideDurationAsc] =
    useState<boolean>(false);
  const [sortCadenceAsc, setSortCadenceAsc] = useState<boolean>(false);
  const [sortStrideLengthAsc, setSortStrideLengthAsc] =
    useState<boolean>(false);
  const [sortWalkingSpeedAsc, setSortWalkingSpeedAsc] =
    useState<boolean>(false);

  // table "pagination"
  const [currentGroup, setCurrentGroup] = useState<number>(0);
  const [groupRecordsNumber, setGroupRecordsNumber] = useState<number>(5);

  // sorting functions
  function getSortParamState(param: PerWbDataField) {
    switch (param) {
      case "wb_id":
        return sortIdAsc;
      case "n_strides":
        return sortNStridesAsc;
      case "duration_s":
        return sortDurationAsc;
      case "stride_duration_s":
        return sortStrideDurationAsc;
      case "cadence_spm":
        return sortCadenceAsc;
      case "stride_length_m":
        return sortStrideLengthAsc;
      case "walking_speed_mps":
        return sortWalkingSpeedAsc;
      default:
        return false;
    }
  }

  function sortOneParam(param: PerWbDataField) {
    // flip the sort order if same param is clicked
    setSortIdAsc(param === "wb_id" && !sortIdAsc);
    setSortNStridesAsc(param === "n_strides" && !sortNStridesAsc);
    setSortStrideDurationAsc(
      param === "stride_duration_s" && !sortStrideDurationAsc
    );
    setSortDurationAsc(param === "duration_s" && !sortDurationAsc);
    setSortCadenceAsc(param === "cadence_spm" && !sortCadenceAsc);
    setSortStrideLengthAsc(param === "stride_length_m" && !sortStrideLengthAsc);
    setSortWalkingSpeedAsc(
      param === "walking_speed_mps" && !sortWalkingSpeedAsc
    );

    setDisplayedWbParameters(
      sortWbsByProperty(
        displayedWbParameters!,
        param as keyof PerWbParameter,
        getSortParamState(param)
      )
    );
  }

  // dragging and swapping rows
  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    wb_id: number
  ) => {
    e.dataTransfer?.setData("wb_id", wb_id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLTableRowElement>,
    wb_id: number
  ) => {
    // swap positions
    const draggedWbId = Number(e.dataTransfer?.getData("wb_id"));
    const draggedWb = displayedWbParameters.find(
      (wb) => wb.wb_id === draggedWbId
    );

    const swapWb = displayedWbParameters.find((wb) => wb.wb_id === wb_id);
    const draggedWbIndex = displayedWbParameters.indexOf(draggedWb!);
    const swapWbIndex = displayedWbParameters.indexOf(swapWb!);
    const newPerWbParameters = [...displayedWbParameters];
    newPerWbParameters[draggedWbIndex] = swapWb!;
    newPerWbParameters[swapWbIndex] = draggedWb!;

    setDisplayedWbParameters(newPerWbParameters);
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        <Label>Number of records in each group</Label>
        <Input
          type="number"
          step="1"
          className="w-[60px]"
          defaultValue={5}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value > 0) {
              setGroupRecordsNumber(value);
              // reset the current group
              setCurrentGroup(0);
            }
          }}
          data-testid="group-records-input"
        />
      </div>
      <Table data-testid="per-wb-params-table">
        <TableHeader>
          <TableRow>
            <TableHead>
              WB ID <SortIcon onClick={() => sortOneParam("wb_id")} />
            </TableHead>
            <TableHead>
              Number of strides{" "}
              <SortIcon onClick={() => sortOneParam("n_strides")} />
            </TableHead>
            <TableHead>
              WB Duration (s){" "}
              <SortIcon onClick={() => sortOneParam("duration_s")} />
            </TableHead>
            <TableHead>
              Stride duration (s){" "}
              <SortIcon onClick={() => sortOneParam("stride_duration_s")} />
            </TableHead>
            <TableHead>
              Cadence (steps/min){" "}
              <SortIcon onClick={() => sortOneParam("cadence_spm")} />
            </TableHead>
            <TableHead>
              Stride length (m){" "}
              <SortIcon onClick={() => sortOneParam("stride_length_m")} />
            </TableHead>
            <TableHead>
              Walking speed (m/s){" "}
              <SortIcon onClick={() => sortOneParam("walking_speed_mps")} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedWbParameters
            .slice(
              currentGroup * groupRecordsNumber,
              currentGroup * groupRecordsNumber + groupRecordsNumber
            )
            .map((param: PerWbParameter) => (
              <TableRow
                key={param.wb_id}
                data-testid={`table-wb-row`}
                draggable
                onDragStart={(e) => handleDragStart(e, param.wb_id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, param.wb_id)}
              >
                <TableCell>{param.wb_id}</TableCell>
                <TableCell>{roundToNDpIfNeeded(param.n_strides, 5)}</TableCell>
                <TableCell>{roundToNDpIfNeeded(param.duration_s, 5)}</TableCell>
                <TableCell>
                  {roundToNDpIfNeeded(param.stride_duration_s, 5)}
                </TableCell>
                <TableCell>
                  {roundToNDpIfNeeded(param.cadence_spm, 5)}
                </TableCell>
                <TableCell>
                  {roundToNDpIfNeeded(param.stride_length_m, 5)}
                </TableCell>
                <TableCell>
                  {roundToNDpIfNeeded(param.walking_speed_mps, 5)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="space-x-2">
        {[
          ...Array(
            divideThenRoundUpToInt(
              displayedWbParameters.length,
              groupRecordsNumber
            )
          ).keys(),
        ].map((num) => (
          <Button
            key={num}
            variant="outline"
            size="icon"
            onClick={() => setCurrentGroup(num)}
            data-testid="table-pagination-button"
          >
            {num}
          </Button>
        ))}
      </div>
    </>
  );
}
