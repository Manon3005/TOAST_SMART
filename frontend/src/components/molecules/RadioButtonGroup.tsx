import { ChangeEvent, useState } from "react";
import { RadioOption } from "../../types/RadioOption";

export const RadioButtonGroup = ({
  onSelectionChange,
  radioOptions,
  defaultValue,
}: {
  onSelectionChange: (value: string) => void;
  radioOptions: RadioOption[];
  defaultValue: string;
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    if (onSelectionChange) {
      onSelectionChange(event.target.value);
    }
  };

  return (
    <div className="w-full flex flex-col items-start gap-[10px]">
      {radioOptions.map(({ value, label }) => (
        <div key={value} className="flex w-full text-black gap-[5px]">
          <input
            type="radio"
            id={value}
            value={value}
            checked={selectedValue === value}
            onChange={handleChange}
          />
          <label className="text-black" htmlFor={value}>
            {label}
          </label>
        </div>
      ))}
    </div>
  );
};
