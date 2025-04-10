import { Label } from "@/components/shadcn-components/label";
import { Slider } from "@/components/shadcn-components/slider";

interface Props {
  binSize: number;
  setBinSize: (binSize: number) => void;
  max: number;
  min: number;
  step: number;
}
export default function BinSlider({
  binSize,
  setBinSize,
  max,
  min,
  step,
}: Props) {
  return (
    <div>
      <Label>Select the number of bins</Label>
      <div className="flex flex-col items-center">
        <div className="flex gap-5 w-full">
          <span>{min}</span>
          <Slider
            defaultValue={[binSize]}
            onValueChange={([val]) => setBinSize(val)}
            max={max}
            min={min}
            step={step}
          />
          <span>{max}</span>
        </div>
        <span>{binSize}</span>
      </div>
    </div>
  );
}
