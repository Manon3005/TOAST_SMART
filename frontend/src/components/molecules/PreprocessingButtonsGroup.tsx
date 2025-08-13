import { Button } from "../atoms/Button";

export const PreprocessingButtonsGroup = ({
  nameFile,
  tableData,
  handleFileProcessing,
  actionReset,
}: {
  nameFile: string;
  tableData: any[];
  handleFileProcessing: () => void;
  actionReset: () => void;
}) => {
  return (
    <div className="flex flex-row justify-center gap-[50px]">
      <Button
        disabled={nameFile == "" || tableData.some((value) => value === "")}
        text="Traiter le CSV"
        className="py-[12px] px-[24px] bg-[#00c21a] hover:bg-[#00ff00] outline-2 outline-black text-black text-[1rem] rounded-[8px] cursor-pointer whitespace-nowrap	transition-colors transition-transform duration-300 transform hover:-translate-y-[1px]"
        onClick={handleFileProcessing}
      />
      <Button
        onClick={actionReset}
        text="Annuler"
        className="py-[12px] px-[24px] bg-[#fa5c5c] hover:bg-[#ff0000] outline-2 outline-black text-black text-[1rem] rounded-[8px] cursor-pointer whitespace-nowrap	transition-colors transition-transform duration-300 transform hover:-translate-y-[1px]"
      />
    </div>
  );
};
