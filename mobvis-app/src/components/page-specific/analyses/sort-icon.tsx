import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  onClick: () => void;
}
export default function SortIcon({ onClick }: Props) {
  return (
    <FontAwesomeIcon
      icon={faSort}
      className="hover:cursor-pointer"
      onClick={onClick}
      data-testid="sort-icon"
    />
  );
}
