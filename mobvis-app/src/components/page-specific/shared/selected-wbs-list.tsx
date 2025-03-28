import { colours } from "@/lib/utils";
import { faCircle, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  wbs: number[];
  setWbs: (wbs: number[]) => void;
  horizontal?: boolean;
  splitLR?: boolean;
}

const orientationConfig = {
  horizontal: "flex gap-6",
  vertical: "",
};
export default function SelectedWbsList({
  wbs,
  setWbs,
  horizontal = false,
  splitLR = false,
}: Props) {
  const style = horizontal
    ? orientationConfig.horizontal
    : orientationConfig.vertical;

  let listItems;
  if (splitLR) {
    listItems = ["Left", "Right"].map((side, i) => (
      <li key={side} className="flex items-center gap-2">
        <p className="min-w-[10px]">{side}</p>
        <FontAwesomeIcon icon={faCircle} color={colours[i]} />
      </li>
    ));
  } else {
    listItems = wbs.map((wb, i) => (
      <li key={wb} className="flex items-center gap-2">
        <p className="min-w-[10px]">{wb}</p>
        <FontAwesomeIcon icon={faCircle} color={colours[i]} />
        <FontAwesomeIcon
          icon={faX}
          className="ml-1 cursor-pointer"
          onClick={() => setWbs(wbs.filter((id) => id !== wb))}
        />
      </li>
    ));
  }

  return (
    <>
      {splitLR && (
        <p>
          <span className="font-semibold">Selected WB: </span>
          {wbs[0]}
        </p>
      )}
      <ul className={style}>{listItems}</ul>
    </>
  );
}
