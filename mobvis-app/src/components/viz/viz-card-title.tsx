import { CardTitle as ShadcnCardTitle } from "@/components/shadcn-components/card";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function VizCardTitle({ children }: Props) {
  return <ShadcnCardTitle className="text-xl">{children}</ShadcnCardTitle>;
}
