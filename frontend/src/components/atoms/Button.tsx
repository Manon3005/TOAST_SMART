export const Button = ({
  className = "py-[12px] px-[24px] bg-white hover:bg-black disabled:hover:bg-white rounded-[8px] outline-2 outline-black hover:outline-white disabled:hover:outline-black text-[1rem] text-black hover:text-white disabled:hover:text-black cursor-pointer whitespace-nowrap transition-transform duration-300 transform hover:-translate-y-[1px] disabled:hover:translate-y-0 disabled:cursor-not-allowed",
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
