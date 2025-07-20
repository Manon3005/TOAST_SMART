import { ChangeEvent, useState } from 'react';
import '../../styles/App.css';
import { RadioOption } from '../../types/RadioOption';

export const RadioButtonGroup = ({
    onSelectionChange,
    radioOptions,
    defaultValue,
  } : {
    onSelectionChange: (value: string) => void,
    radioOptions: RadioOption[],
    defaultValue: string
  }) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
      setSelectedValue(event.target.value);
      if (onSelectionChange) {
        onSelectionChange(event.target.value);
      }
    };

    return (
    <div className="radio-group">
      {radioOptions.map(({ value, label }) => (
        <div key={value} className="radio-option">
          <input
            type="radio"
            id={value}
            value={value}
            checked={selectedValue === value}
            onChange={handleChange}
          />
          <label htmlFor={value}>{label}</label>
        </div>
      ))}
    </div>
    );
}