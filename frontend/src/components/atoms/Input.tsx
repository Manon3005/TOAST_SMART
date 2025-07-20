import { ChangeEvent } from 'react';
import '../../styles/App.css';

export const Input = ({
    value,
    onChange,
    disabled,
    min,
    type,
    text
}: {
    value: string,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    disabled: boolean,
    min: number,
    type: React.HTMLInputTypeAttribute,
    text: string
}) => {
  return (
    <input 
        className='glass-number' 
        onChange={onChange} 
        disabled={disabled}
        value={value}
        min={min}
        type={type}
    >
        {text}
    </input>
    );
}