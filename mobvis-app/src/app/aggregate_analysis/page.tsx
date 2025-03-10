"use client";

import HyperLink from "@/components/custom/hyperlink";

export default function AggregateAnalysis() {
  // TODO: render not found form if no inputs submitted.
  const inputs = JSON.parse(localStorage.getItem("inputs") ?? "");

  return (
    <div className="p-10 text-white border border-red-500">
      <h1 className="text-4xl font-bold mb-2">📦 Aggregate-level analysis</h1>
      <p>
        Visualisations for aggregate gait parameters extracted from{" "}
        <span className="font-semibold">{inputs.name}</span>.{" "}
        <HyperLink url="">Click here</HyperLink> to see the inputs you&apos;ve
        submitted.
      </p>
    </div>
  );
}
