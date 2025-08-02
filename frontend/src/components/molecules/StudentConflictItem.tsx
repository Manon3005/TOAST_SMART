const StudentConflictItem = ({
  name,
  surname,
  conflictCount,
  onClick,
}: {
  name: string;
  surname: string;
  conflictCount: number;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex flex-row justify-between items-center bg-white hover:bg-[#eef1f5] rounded-[8px] px-[16px] py-[12px] text-black cursor-pointer transition-colors duration-200 ease-in-out"
      onClick={onClick}
    >
      <div className="font-bold text-[16px]">
        {name} {surname}
      </div>
      <div
        className={`font-medium ${
          conflictCount > 0 ? "text-[#d33]" : "text-[#06ad2a]"
        }`}
      >
        {conflictCount} conflit{conflictCount > 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default StudentConflictItem;
