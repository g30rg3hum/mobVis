import Link from "next/link";

interface Props {
  url: string;
  children: React.ReactNode;
}
export default function HyperLink({ url, children }: Props) {
  return (
    <Link href={url} className="text-sky-500 underline">
      {children}
    </Link>
  );
}
