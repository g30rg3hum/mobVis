import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  size: "2x" | "3x" | "4x" | "5x" | "6x";
  textSize: "2xl" | "3xl" | "4xl" | "5xl";
}

const fontSizeConfig = {
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
};

export default function Logo({ size, textSize }: Props) {
  return (
    <span className="flex gap-4 font-black flex justify-center items-center">
      <FontAwesomeIcon icon={faChartSimple} size={size} />
      <h1 className={fontSizeConfig[textSize]}>mobVis</h1>
    </span>
  );
}
