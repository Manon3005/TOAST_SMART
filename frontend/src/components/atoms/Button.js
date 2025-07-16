import '../../styles/App.css';

export const Button = ({
  className = 'classic-button',
  text, 
  onClick,
  disabled = false,
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