import Link from "next/link";

interface Props {
  text: string;
  url: string;
}
export default function HyperLink({ text, url }: Props) {
  return (
    <Link href={url} className="text-sky-500 underline">
      {text}
    </Link>
  );
}
