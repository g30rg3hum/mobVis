import { CardDescription as ShadcnCardDescription } from "@/components/shadcn-components/card";

interface Props {
  subheading?: string;
  descriptions: string[];
  exampleAnalysis: string;
}
export default function VizCardDescription({
  subheading,
  descriptions,
  exampleAnalysis,
}: Props) {
  return (
    <ShadcnCardDescription className="text-md">
      <p className="font-semibold mb-2">{subheading}</p>
      <div className="space-y-2">
        {descriptions.map((description, index) => (
          <p key={index}>{description}</p>
        ))}
      </div>
      <br />
      <span>
        <b>Example analysis: </b>
        {exampleAnalysis}
      </span>
    </ShadcnCardDescription>
  );
}
