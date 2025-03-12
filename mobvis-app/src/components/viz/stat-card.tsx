import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../shadcn-components/card";

interface Props {
  name: string;
  value: string | number;
  wrap?: boolean;
}

const wrapStyleConfig = {
  wrap: "text-center w-max p-2",
  noWrap: "text-center w-full p-2",
};
export default function StatCard({ name, value, wrap = false }: Props) {
  const style = wrap ? wrapStyleConfig.wrap : wrapStyleConfig.noWrap;
  return (
    <Card className={style}>
      <CardHeader className="font-bold text-xl">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="text-5xl font-black text-primary">
        {value}
      </CardContent>
    </Card>
  );
}
