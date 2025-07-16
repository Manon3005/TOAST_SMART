import '../../styles/App.css';

export const Input = ({
    value,
    onChange,
    disabled,
    min,
    type,
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