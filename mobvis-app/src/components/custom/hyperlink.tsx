import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  url?: string;
  children: ReactNode;
  onClick?: () => void;
  download?: boolean;
}
export default function HyperLink({ url, children, onClick, download }: Props) {
  return (
    <Link
      href={url ?? ""}
      className="text-sky-600 underline"
      onClick={onClick}
      download={download}
    >
      {children}
    </Link>
  );
}
