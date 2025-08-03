import { ReactNode } from "react";

export const Select = ({
  children,
  value,
  onChange,
  disabled,
}: {
  children: ReactNode;
  value: number | string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}) => {
  return (
    <select
      className="w-[70%] p-[5px] text-black border border-[#ccc] rounded-[10px] truncate"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {children}
    </select>
  );
};
