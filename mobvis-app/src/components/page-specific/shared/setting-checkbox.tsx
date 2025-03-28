import { Label } from "@radix-ui/react-label";

interface Props {
  state: boolean;
  setState: (state: boolean) => void;
  inputId: string;
  label: string;
  disabled?: boolean;
}
export default function SettingCheckbox({
  state,
  setState,
  inputId,
  label,
  disabled = false,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <input
        type="checkbox"
        value={state.toString()}
        onChange={(el) => setState(el.target.checked)}
        className="w-4 h-4"
        id={inputId}
        disabled={disabled}
      />
      <Label htmlFor={inputId}>{label}</Label>
    </div>
  );
}
