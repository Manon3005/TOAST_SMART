import { ChangeEvent } from "react";

export const Input = ({
  value,
  onChange,
  disabled,
  min,
  type,
}: {
  value: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  min: string;
  type: React.HTMLInputTypeAttribute;
}) => {
  return (
    <input
      className="w-[80px] h-[20px] bg-white border border-[#043100] focus:border-[#4a90e2] rounded-[12px] p-[10px] text-[18px] text-black placeholder-white placeholder-opacity-60 backdrop-blur-[10px]"
      placeholder="0"
      onChange={onChange}
      disabled={disabled}
      value={value}
      min={min}
      type={type}
    ></input>
  );
};
