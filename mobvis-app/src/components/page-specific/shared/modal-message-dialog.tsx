import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-components/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

interface Props {
  modalMessage: string | undefined;
  setModalMessage: (message: string | undefined) => void;
}
export default function ModalMessageDialog({
  modalMessage,
  setModalMessage,
}: Props) {
  return (
    <Dialog
      open={modalMessage !== undefined}
      onOpenChange={() => setModalMessage(undefined)}
    >
      <DialogContent data-testid="inputs-dialog" className="p-10">
        <DialogHeader>
          <DialogTitle className="font-semibold">Attention! 🚨</DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            This is important!
          </DialogDescription>
        </DialogHeader>
        <p>{modalMessage}</p>
      </DialogContent>
    </Dialog>
  );
}
