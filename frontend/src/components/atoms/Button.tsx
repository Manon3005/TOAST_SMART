import '../../styles/App.css';

export const Button = ({
  className = 'classic-button',
  text, 
  onClick,
  disabled = false,
} : {
  className?: string,
  text: string,
  onClick: () => void,
  disabled?: boolean
}) => {
  return (
    <button 
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
        {text}
    </button>
    );
}