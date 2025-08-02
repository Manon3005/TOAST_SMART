export const Button = ({
  className = "py-[12px] px-[24px] bg-white hover:bg-black rounded-[8px] outline-2 outline-black hover:outline-white text-[1rem] text-black hover:text-white cursor-pointer cursor-pointer whitespace-nowrap	transition-colors transition-transform duration-300 transform hover:-translate-y-[1px]",
  text,
  onClick,
  disabled = false,
}: {
  className?: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};
