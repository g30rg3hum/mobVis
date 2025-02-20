import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function ErrorMsg({ children }: Props) {
  return <span className="text-sm text-red-500">{children}</span>;
}
