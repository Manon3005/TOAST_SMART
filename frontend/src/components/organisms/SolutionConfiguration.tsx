import { Input } from "../atoms/Input";

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
      <h2 className="w-full text-center text-black text-[18px] font-bold">
        Configuration de tables :
      </h2>
      <div className="w-full flex flex-row items-center justify-between gap-[20px]">
        <p className="w-fit text-black text-left">Nombre de tables maximum :</p>
        <Input
          type="number"
          value={maxTables}
          onChange={handleMaxTablesInputChange}
          min="1"
          disabled={false}
        ></Input>
      </div>
      <div className="w-full flex flex-row items-center justify-between gap-[20px]">
        <p className="w-fit text-black text-left">
          Nombre de convives maximum/table :
        </p>
        <Input
          type="number"
          value={maxGuests}
          onChange={handleMaxGuestsInputChange}
          min="1"
          disabled={false}
        ></Input>
      </div>
    </div>
  );
};
