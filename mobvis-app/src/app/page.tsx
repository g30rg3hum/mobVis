"use client";

import FadeInScroll from "@/components/custom/animation-scroll";
import HyperLink from "@/components/custom/hyperlink";
import Logo from "@/components/layout/logo";
import NewAnalysisForm from "@/components/page-specific/analyses/new-analysis-form";

export default function Home() {
  return (
    <div className="flex flex-row justify-center items-center mt-20 py-8 gap-5 items-stretch">
      <FadeInScroll>
        <div className="w-[600px] border border-black rounded-lg p-5 bg-white space-y-5 text-justify flex flex-col justify-center h-full">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex">
              What is{" "}
              <span className="mx-2">
                <Logo size="1x" textSize="2xl" gap="gap-2" />
              </span>
              ?
            </h1>
            <p>
              <b>mobVis</b> is a visualisation interface tool for clinicians
              which generates useful graphs, charts and plots around walking
              data. Gait parameters (e.g. walking speed), also known as Digital
              Mobility Outcomes (DMOs), are extracted from the recorded walking
              data you submit (on the right) and visualised.
            </p>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex">Who is this made for?</h1>
            <p>
              Target users are clinicians who specifically{" "}
              <b>work with patients who have multiple sclerosis (MS)</b>, a
              condition which affects mobility. The hope is that generated
              visualisations will aid in forming conclusions about patient gait
              and thus overall mobility.
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
              <br />{" "}
            </p>
            <p className="pt-1">
              <span className="text-red-500">IMPORTANT: </span> if you submit
              walking data of subjects who are not impaired by MS, the extracted
              gait parameters will likely be invalid/unsound.
            </p>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold flex">How do I use this?</h1>
            <p>
              Simply fill in the form on the right and click &quot;Extract and
              Save&quot;. Analysis can be done on three levels, from most to
              least granular: <b>overview/summary</b>, <b>per-walking-bout</b>{" "}
              (since the patient might not always be walking throughout the
              entire recording) and <b>per-stride</b> (of each walking bout).
            </p>
            <p className="pt-1">
              Simply navigate to the respective page by clicking on the top
              links. It is useful to note that one set of gait parameters are
              extracted and saved from the latest submission of inputs, i.e.
              only one analysis for one walking assessment captured by one CSV
              recording file can be done at a time.
            </p>
          </div>
        </div>
      </FadeInScroll>

      <FadeInScroll>
        <div className="w-[600px] border border-black rounded-lg p-5 bg-white h-full flex flex-col justify-center">
          <div className="mb-5">
            <h1 className="text-2xl font-bold flex">New gait assessment</h1>
            <p className="text-slate-600 mt-1">
              Input and save details about the recording for your gait
              assessment. DMOs will be extracted from the inputs you submit
              here.
            </p>
          </div>

          <NewAnalysisForm />
        </div>
      </FadeInScroll>
    </div>
  );
}
