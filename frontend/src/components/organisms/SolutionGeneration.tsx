import { Button } from "../atoms/Button";

export const SolutionGeneration = ({
  handleOnClickGenerate,
  handleOnClickImport,
  outputFilePath,
  tableGroupFilePath,
}: {
  handleOnClickGenerate: () => void;
  handleOnClickImport: () => void;
  outputFilePath: string | undefined;
  tableGroupFilePath: string | undefined;
}) => {
  return (
    <div className="w-full flex flex-col justify-start gap-[5px]">
      <div className="w-full flex flex-row justify-between">
        <Button
          onClick={handleOnClickGenerate}
          text="Générer la solution"
        ></Button>
        <Button
          onClick={handleOnClickImport}
          text="📁 Importer une solution"
        ></Button>
      </div>
      {outputFilePath && (
        <div className="w-full flex flex-row items-center justify-start">
          <span className="font-bold text-black text-[13px]">
            {"Solution :\u00A0"}
          </span>
          <span className="text-black text-[13px]">{outputFilePath}</span>
        </div>
      )}
      {tableGroupFilePath && (
        <div className="w-full flex flex-row items-center justify-start">
          <span className="font-bold text-black text-[13px]">
            {"Groupement des tables :\u00A0"}
          </span>
          <span className="text-black text-[13px]">{tableGroupFilePath}</span>
        </div>
      )}
    </div>
  );
};
