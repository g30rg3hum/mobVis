import HyperLink from "@/components/custom/hyperlink";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-components/dialog";

/* eslint-disable @next/next/no-img-element */
interface Props {
  isDataRequirementsModalOpen: boolean;
  setIsDataRequirementsModalOpen: (open: boolean) => void;
}
export default function InputRequirementsDialog({
  isDataRequirementsModalOpen,
  setIsDataRequirementsModalOpen,
}: Props) {
  return (
    <Dialog
      open={isDataRequirementsModalOpen}
      onOpenChange={setIsDataRequirementsModalOpen}
    >
      <DialogContent
        data-testid="data-requirements-dialog"
        className="w-full max-w-[650px] p-10"
      >
        <DialogHeader>
          <DialogTitle className="font-semibold">
            CSV data file requirements
          </DialogTitle>
          <DialogDescription>
            <span className="text-slate-500">
              Ensure that your data file satisfies all of these requirements.
            </span>
          </DialogDescription>
        </DialogHeader>
        <ul className="list-disc list-inside space-y-3">
          <li>
            The values should be collected by an{" "}
            <b>IMU sensor device worn on the lower back by a person with MS</b>.
          </li>
          <li>
            The CSV data file should contain columns (i.e. the first line is):
            <b> samples, acc_x, acc_y, acc_z, gyr_x, gyr_y, gyr_z.</b>
            <ul className="pl-10 list-disc">
              <li>Each row contains values for each of these columns.</li>
              <li>“samples” is an id for each row, beginning from 0.</li>
              <li>
                acc_x to z are acceleration values in m/s² in each axis of the
                expected coordinate system (see image below).
                <ul className="pl-10 list-disc">
                  <li>
                    If values are ±1, then they are likely in g. If so, tick the
                    checkbox on the form so the system will convert to m/s² for
                    you.
                  </li>
                  <li>
                    If values are ±9.81, then they are likely already in m/s².
                  </li>
                </ul>
              </li>
              <li>
                gyr_x to z are rotation rates in deg/s in each axis of the
                expected coordinate system.
              </li>
            </ul>
          </li>
          <li>
            <HyperLink url="sample_file.csv" download>
              Download this sample file
            </HyperLink>{" "}
            to get an idea of the expected format (acceleration values are in
            g).
          </li>
        </ul>
        <div className="flex-col flex items-center justify-center mt-2">
          <h3 className="font-bold">Expected coordinate system:</h3>
          <img
            src="coordinate_system.png"
            alt="Coordinate System"
            width="200"
            className="rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
