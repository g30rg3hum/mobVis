"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/table";
import SortIcon from "../analyses/sort-icon";
import {
  PerStrideDataField,
  PerStrideParameter,
  PerStrideParameters,
} from "@/types/parameters";
import React, { useState } from "react";
import {
  divideThenRoundUpToInt,
  groupPerStrideParametersByWbId,
  NAIfZeroElseRoundTo5Dp,
  sortStridesByProperty,
} from "@/lib/utils";
import { Label } from "@/components/shadcn-components/label";
import { Button } from "@/components/shadcn-components/button";
import { Input } from "@/components/shadcn-components/input";
import SwitchWb from "./switch-wb";

interface Props {
  allPerStrideParameters: PerStrideParameters;
}
export default function TableOfPerStrideParameters({
  allPerStrideParameters,
}: Props) {
  const mapWbIdToPerStrideParameters = groupPerStrideParametersByWbId(
    allPerStrideParameters
  );
  const [currentWbId, setCurrentWbId] = useState<number>(0);
  const [displayedPerStrideParameters, setDisplayedPerStrideParameters] =
    useState<PerStrideParameters>(
      mapWbIdToPerStrideParameters.get(currentWbId)!
    );
  const wbCount = mapWbIdToPerStrideParameters.size;

  // table "pagination"
  const [currentGroup, setCurrentGroup] = useState<number>(0);
  const [groupRecordsNumber, setGroupRecordsNumber] = useState<number>(5);

  // store the previous sort state for each column
  const [sortIdAsc, setSortIdAsc] = useState<boolean>(true);
  const [sortLRAsc, setSortLRAsc] = useState<boolean>(false);
  const [sortStrideDurationAsc, setSortStrideDurationAsc] =
    useState<boolean>(false);
  const [sortCadenceAsc, setSortCadenceAsc] = useState<boolean>(false);
  const [sortStrideLengthAsc, setSortStrideLengthAsc] =
    useState<boolean>(false);
  const [sortWalkingSpeedAsc, setSortWalkingSpeedAsc] =
    useState<boolean>(false);

  // sorting functions
  function getSortParamState(param: PerStrideDataField) {
    switch (param) {
      case "s_id":
        return sortIdAsc;
      case "lr_label":
        return sortLRAsc;
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

  function sortOneParam(param: PerStrideDataField) {
    const sortParamState = getSortParamState(param);

    // flip the sort order if same param is clicked
    setSortIdAsc(param === "s_id" && !sortIdAsc);
    setSortLRAsc(param === "lr_label" && !sortLRAsc);
    setSortStrideDurationAsc(
      param === "stride_duration_s" && !sortStrideDurationAsc
    );
    setSortCadenceAsc(param === "cadence_spm" && !sortCadenceAsc);
    setSortStrideLengthAsc(param === "stride_length_m" && !sortStrideLengthAsc);
    setSortWalkingSpeedAsc(
      param === "walking_speed_mps" && !sortWalkingSpeedAsc
    );

    setDisplayedPerStrideParameters(
      sortStridesByProperty(
        displayedPerStrideParameters,
        param as keyof PerStrideParameter,
        !sortParamState
      )
    );
  }

  // dragging and swapping rows
  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement>,
    s_id: number
  ) => {
    e.dataTransfer?.setData("s_id", s_id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLTableRowElement>,
    s_id: number
  ) => {
    const draggedSId = Number(e.dataTransfer?.getData("s_id"));
    const draggedStride = displayedPerStrideParameters.find(
      (stride) => stride.s_id === draggedSId
    );

    const swapStride = displayedPerStrideParameters.find(
      (stride) => stride.s_id === s_id
    );

    const draggedStrideIndex = displayedPerStrideParameters.indexOf(
      draggedStride!
    );
    const swapStrideIndex = displayedPerStrideParameters.indexOf(swapStride!);

    const newPerStrideParameters = [...displayedPerStrideParameters];
    newPerStrideParameters[draggedStrideIndex] = swapStride!;
    newPerStrideParameters[swapStrideIndex] = draggedStride!;

    setDisplayedPerStrideParameters(newPerStrideParameters);
  };

  return (
    <>
      <div className="flex gap-8">
        <SwitchWb
          currentWbId={currentWbId}
          setCurrentWbId={setCurrentWbId}
          wbCount={wbCount}
          prevOperations={() => {
            setDisplayedPerStrideParameters(
              mapWbIdToPerStrideParameters.get(currentWbId - 1)!
            );
            setCurrentGroup(0);
          }}
          nextOperations={() => {
            setDisplayedPerStrideParameters(
              mapWbIdToPerStrideParameters.get(currentWbId + 1)!
            );
            setCurrentGroup(0);
          }}
        />

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
      </div>

      <Table data-testid="per-stride-params-table">
        <TableHeader>
          <TableRow>
            <TableHead>
              Stride ID{" "}
              <SortIcon
                onClick={() => {
                  sortOneParam("s_id");
                }}
              />
            </TableHead>
            <TableHead>
              Left/Right{" "}
              <SortIcon
                onClick={() => {
                  sortOneParam("lr_label");
                }}
              />
            </TableHead>
            <TableHead>
              Stride duration (s){" "}
              <SortIcon
                onClick={() => {
                  sortOneParam("stride_duration_s");
                }}
              />
            </TableHead>
            <TableHead>
              Cadence (spm){" "}
              <SortIcon
                onClick={() => {
                  sortOneParam("cadence_spm");
                }}
              />
            </TableHead>
            <TableHead>
              Stride length (m){" "}
              <SortIcon
                onClick={() => {
                  sortOneParam("stride_length_m");
                }}
              />
            </TableHead>
            <TableHead>
              Walking speed (mps){" "}
              <SortIcon
                onClick={() => {
                  sortOneParam("walking_speed_mps");
                }}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedPerStrideParameters
            .slice(
              currentGroup * groupRecordsNumber,
              currentGroup * groupRecordsNumber + groupRecordsNumber
            )
            .map((perStrideParameter) => (
              <TableRow
                key={`${currentWbId}:${perStrideParameter.s_id}`}
                draggable
                onDragStart={(e) => handleDragStart(e, perStrideParameter.s_id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, perStrideParameter.s_id)}
                data-testid="table-stride-row"
              >
                <TableCell>{perStrideParameter.s_id}</TableCell>
                <TableCell>{perStrideParameter.lr_label}</TableCell>
                <TableCell>
                  {NAIfZeroElseRoundTo5Dp(perStrideParameter.stride_duration_s)}
                </TableCell>
                <TableCell>
                  {NAIfZeroElseRoundTo5Dp(perStrideParameter.cadence_spm)}
                </TableCell>
                <TableCell>
                  {NAIfZeroElseRoundTo5Dp(perStrideParameter.stride_length_m)}
                </TableCell>
                <TableCell>
                  {NAIfZeroElseRoundTo5Dp(perStrideParameter.walking_speed_mps)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="space-x-2">
        {[
          ...Array(
            divideThenRoundUpToInt(
              displayedPerStrideParameters.length,
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
