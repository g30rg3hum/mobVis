import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HyperLink from "./hyperlink";

export default function LookingForData() {
  return (
    <div className="flex flex-col justify-center gap-5 items-center">
      <FontAwesomeIcon icon={faSpinner} spin className="text-5xl" />
      <h1 className="font-black text-3xl">
        Looking for assessment input data...
      </h1>
      <p>
        Are you sure you submitted the <HyperLink url="/">form?</HyperLink>
      </p>
    </div>
  );
}
