import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, TooltipProvider } from "../shadcn-components/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

interface Props {
  size: "1x" | "2x" | "3x" | "4x" | "5x" | "6x";
  text: string;
}
export default function InformationTooltip({ size, text }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <FontAwesomeIcon
            size={size}
            icon={faInfoCircle}
            className="inline-block hover:cursor-pointer"
          />
        </TooltipTrigger>
        <TooltipContent className="p-2 bg-black text-white rounded-md max-w-[200px] m-2">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
