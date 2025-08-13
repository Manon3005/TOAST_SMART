import { ReactNode } from "react";

export const Option = ({
  children,
  key,
  value,
  disabled = false,
}: {
  children: ReactNode;
  key: number | string;
  value: number | string;
  disabled?: boolean;
}) => {
  return (
    <option className="text-black" key={key} value={value} disabled={disabled}>
      {children}
    </option>
  );
};
