"use client";

import FadeInScroll from "@/components/custom/animation-scroll";
import HyperLink from "@/components/custom/hyperlink";
import Logo from "@/components/layout/logo";
import NewAnalysisForm from "@/components/page-specific/analyses/new-analysis-form";

export default function Home() {
  return (
    <div className="flex flex-row justify-center items-center mt-20 py-8 gap-5 items-stretch">
      <FadeInScroll>
        <div className="w-[500px] border border-black rounded-lg p-5 bg-white space-y-5 text-justify flex flex-col justify-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex">
              What is{" "}
              <span className="mx-2">
                <Logo size="1x" textSize="2xl" gap="gap-2" />
              </span>
              ?
            </h1>
            <p>
              <b>mobVis</b> is a visualisation interface tool which generates
              useful graphs, charts and plots around walking data inputted by
              the user. Gait parameters, also known as Digital Mobility Outcomes
              (DMOs), are extracted from the data and visualised.
            </p>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex">Who should use this?</h1>
            <p>
              The target users are clinicians who work with patients who have
              multiple sclerosis, a condition which affects mobility. The hope
              is that generated visualisations will aid in forming conclusions
              about patient gait.
            </p>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex">How are DMOs extracted?</h1>
            <p>
              They are obtained using the Mobilise-D algorithm pipeline [
              <HyperLink url="https://www.nature.com/articles/s41598-024-51766-5">
                1
              </HyperLink>
              ,{" "}
              <HyperLink url="https://jneuroengrehab.biomedcentral.com/articles/10.1186/s12984-023-01198-5">
                2
              </HyperLink>
              ] recommended for multiple sclerosis, implemented in Python by{" "}
              <HyperLink url="https://github.com/mobilise-d/mobgap/">
                mobgap
              </HyperLink>
              .
            </p>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex">How do I use this?</h1>
            <p>
              Simply fill in the form on the right and click "Extract and Save".
              Analysis can be done on an <b>aggregate level</b>,{" "}
              <b>per walking-bout level</b> and <b>per-stride level</b>. Simply
              navigate to the respective page by clicking on the top links.
            </p>
          </div>
        </div>
      </FadeInScroll>

      <FadeInScroll>
        <div className="w-[600px] border border-black rounded-lg p-5 bg-white">
          <NewAnalysisForm />
        </div>
      </FadeInScroll>
    </div>
  );
}
