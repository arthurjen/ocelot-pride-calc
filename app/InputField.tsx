import { FormState } from "./types";

interface InputFieldProps {
  label: string;
  field: keyof FormState;
  min?: number;
  value: number;
  type?: string;
  onChange: (field: keyof FormState, value: number) => void;
}

export function InputField({
  label,
  field,
  min = 0,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2 py-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {label}
      </label>
      <input
        type="number"
        min={min}
        value={value as number}
        onChange={(e) =>
          onChange(field, Math.max(min, parseInt(e.target.value) || 0))
        }
        className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );
};
