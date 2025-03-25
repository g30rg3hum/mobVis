import { Button } from "@/components/shadcn-components/button";
import { Label } from "@/components/shadcn-components/label";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  currentWbId: number;
  setCurrentWbId: (wbId: number) => void;
  prevOperations?: () => void;
  nextOperations?: () => void;
  wbCount: number;
}
export default function SwitchWb({
  currentWbId,
  setCurrentWbId,
  prevOperations,
  nextOperations,
  wbCount,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <Label>ID of current WB to view</Label>
      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (currentWbId > 0) {
              setCurrentWbId(currentWbId - 1);
              if (prevOperations) {
                prevOperations();
              }
            }
          }}
          data-testid="btn-wb-id-previous"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <div className="text-md font-semibold" data-testid="current-wb-id">
          {currentWbId}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (currentWbId < wbCount - 1) {
              setCurrentWbId(currentWbId + 1);
              if (nextOperations) {
                nextOperations();
              }
            }
          }}
          data-testid="btn-wb-id-next"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
    </div>
  );
}
