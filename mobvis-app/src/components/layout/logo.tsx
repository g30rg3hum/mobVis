import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  size: "1x" | "2x" | "3x" | "4x" | "5x" | "6x";
  textSize: "2xl" | "3xl" | "4xl" | "5xl";
  gap: "gap-1" | "gap-2" | "gap-3" | "gap-4";
}

const fontSizeConfig = {
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
};

const gapConfig = {
  "gap-1":
    "flex gap-1 font-black flex justify-center items-center inline-block w-max",
  "gap-2":
    "flex gap-2 font-black flex justify-center items-center inline-block w-max",
  "gap-3":
    "flex gap-3 font-black flex justify-center items-center inline-block w-max",
  "gap-4":
    "flex gap-4 font-black flex justify-center items-center inline-block w-max",
};

export default function Logo({ size, textSize, gap }: Props) {
  return (
    <span className={gapConfig[gap]}>
      <FontAwesomeIcon icon={faChartSimple} size={size} />
      <h1 className={fontSizeConfig[textSize]}>mobVis</h1>
    </span>
  );
}
