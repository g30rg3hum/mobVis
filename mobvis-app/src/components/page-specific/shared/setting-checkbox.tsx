import { Label } from "@radix-ui/react-label";

interface Props {
  state: boolean;
  setState: (state: boolean) => void;
  inputId: string;
}
export default function SettingCheckbox({ state, setState, inputId }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <input
        type="checkbox"
        value={state.toString()}
        onChange={(el) => setState(el.target.checked)}
        className="w-4 h-4"
        id={inputId}
      />
      <Label htmlFor={inputId}>Step?</Label>
    </div>
  );
}
