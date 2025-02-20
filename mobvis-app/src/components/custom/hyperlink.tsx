import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  url: string;
  children: ReactNode;
}
export default function HyperLink({ url, children }: Props) {
  return (
    <Link href={url} className="text-sky-500 underline">
      {children}
    </Link>
  );
}
