"use client";

import Logo from "@/components/layout/logo";
import NewAnalysisForm from "@/components/page-specific/analyses/new-analysis-form";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-8">
      <div className="w-[600px] bg-background-dark rounded-t-lg text-white p-4 border-t border-l border-r border-black">
        <Logo size="3x" textSize="4xl" />
      </div>

      <div className="w-[600px] border border-black rounded-b-lg p-5 bg-white">
        <NewAnalysisForm />
      </div>
    </div>
  );
}
