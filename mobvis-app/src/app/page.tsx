import NewAnalysisForm from "@/components/page-specific/analyses/new-analysis-form";

export default function Home() {
  return (
    <div>
      <div className="w-[600px] border border-black rounded-lg p-5">
        <NewAnalysisForm />
      </div>
    </div>
  );
}
