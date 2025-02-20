import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function SuccessMsg({ children }: Props) {
  return <span className="text-sm text-green-500">{children}</span>;
}
