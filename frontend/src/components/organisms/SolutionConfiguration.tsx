import { Input } from "../atoms/Input";
import { SubTitle } from "../atoms/SubTitle";
import { SolutionConfigurationInput } from "../molecules/SolutionConfigurationInput";

export const SolutionConfiguration = ({
  maxTables,
  maxGuests,
  handleMaxTablesInputChange,
  handleMaxGuestsInputChange,
}: {
  maxTables: number;
  maxGuests: number;
  handleMaxTablesInputChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleMaxGuestsInputChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) => {
  return (
    <div className="w-full flex flex-col justify-start items-center gap-[10px]">
      <SubTitle>Configuration de tables :</SubTitle>
      <SolutionConfigurationInput
        label={"Nombre de tables maximum :"}
        value={maxTables}
        onChange={handleMaxTablesInputChange}
      />
      <SolutionConfigurationInput
        label={"Nombre de convives maximum/table :"}
        value={maxGuests}
        onChange={handleMaxGuestsInputChange}
      />
    </div>
  );
};
