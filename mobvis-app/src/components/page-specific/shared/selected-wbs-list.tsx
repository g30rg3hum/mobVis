import { colours } from "@/lib/utils";
import { faCircle, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  wbs: number[];
  setWbs: (wbs: number[]) => void;
  horizontal?: boolean;
}

const orientationConfig = {
  horizontal: "flex gap-2",
  vertical: "",
};
export default function SelectedWbsList({
  wbs,
  setWbs,
  horizontal = false,
}: Props) {
  const style = horizontal
    ? orientationConfig.horizontal
    : orientationConfig.vertical;

  return (
    <ul className={style}>
      {wbs.map((wb, i) => (
        <li key={wb} className="flex items-center gap-2">
          <p className="min-w-[10px]">{wb}</p>
          <FontAwesomeIcon icon={faCircle} color={colours[i]} />
          <FontAwesomeIcon
            icon={faX}
            className="ml-1 cursor-pointer"
            onClick={() => setWbs(wbs.filter((id) => id !== wb))}
          />
        </li>
      ))}
    </ul>
  );
}
