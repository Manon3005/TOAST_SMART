import { ChangeEvent } from 'react';
import '../../styles/App.css';

export const Input = ({
    value,
    onChange,
    disabled,
    min,
    type
}: {
    value: number,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    disabled: boolean,
    min: string,
    type: React.HTMLInputTypeAttribute,
}) => {
  return (
    <input 
        className='glass-number'
        placeholder='0' 
        onChange={onChange} 
        disabled={disabled}
        value={value}
        min={min}
        type={type}
    >
    </input>
    );
}