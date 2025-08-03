import { Input } from "../atoms/Input";

export const SolutionConfigurationInput = ({
  label,
  value,
  onChange,
  min = "1",
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  disabled?: boolean;
}) => {
  return (
    <div className="w-full flex flex-row items-center justify-between gap-[20px]">
      <p className="w-fit text-black text-left">{label}</p>
      <Input
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        disabled={disabled}
      />
    </div>
  );
};
