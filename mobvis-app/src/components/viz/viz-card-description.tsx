import { CardDescription as ShadcnCardDescription } from "@/components/shadcn-components/card";

interface Props {
  mainDescription: string;
  exampleAnalysis: string;
}
export default function VizCardDescription({
  mainDescription,
  exampleAnalysis,
}: Props) {
  return (
    <ShadcnCardDescription className="text-md">
      {mainDescription}
      <br />
      <br />
      <span>
        <b>Example analysis: </b>
        {exampleAnalysis}
      </span>
    </ShadcnCardDescription>
  );
}
