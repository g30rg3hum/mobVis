import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-components/dialog";
import { refinedInputFieldNames } from "@/lib/fields";
import { InputsJson } from "@/types/parameters";

interface Props {
  inputs: InputsJson;
  isInputDialogOpen: boolean;
  setIsInputDialogOpen: (isOpen: boolean) => void;
}
export default function InputsDialog({
  inputs,
  isInputDialogOpen,
  setIsInputDialogOpen,
}: Props) {
  return (
    <Dialog open={isInputDialogOpen} onOpenChange={setIsInputDialogOpen}>
      <DialogContent data-testid="inputs-dialog">
        <DialogHeader>
          <DialogTitle className="font-semibold">
            <span className="mr-2">🔣</span>Current inputs
          </DialogTitle>
          <DialogDescription>
            These are the form inputs you submitted for this gait analysis.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-3">
          {Object.keys(inputs).map((input) => (
            <li key={input}>
              <span className="font-medium">
                {refinedInputFieldNames.get(input)}:{" "}
              </span>
              {inputs[input as keyof InputsJson].toString()}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
