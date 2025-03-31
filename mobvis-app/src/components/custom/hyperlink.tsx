import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  url: string;
  children: ReactNode;
  onClick?: () => void;
}
export default function HyperLink({ url, children, onClick }: Props) {
  return (
    <Link href={url} className="text-sky-600 underline" onClick={onClick}>
      {children}
    </Link>
  );
}
