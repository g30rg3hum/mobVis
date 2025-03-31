import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../shadcn-components/card";

interface Props {
  name: string;
  value: string | number;
  wrap?: boolean;
  description?: string;
}

const wrapStyleConfig = {
  wrap: "text-center w-max p-2 h-full flex flex-col justify-center",
  noWrap: "text-center w-full p-2 h-full flex flex-col justify-center",
};
export default function StatCard({
  name,
  value,
  wrap = false,
  description,
}: Props) {
  const style = wrap ? wrapStyleConfig.wrap : wrapStyleConfig.noWrap;
  return (
    <Card className={style}>
      <CardHeader className="font-bold text-xl">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-5xl font-black text-primary">
        {value}
      </CardContent>
    </Card>
  );
}
