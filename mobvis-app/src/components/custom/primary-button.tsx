import { Button } from "../shadcn-components/button";

interface Props {
  text: string;
  onClick: () => void;
}
export default function PrimaryButton({ text, onClick }: Props) {
  return (
    <Button onClick={onClick} className="w-full ">
      {text}
    </Button>
  );
}
