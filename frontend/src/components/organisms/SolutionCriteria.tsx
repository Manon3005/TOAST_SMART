import { RadioOption } from "../../types/RadioOption";
import { RadioButtonGroup } from "../molecules/RadioButtonGroup";

export const SolutionCriteria = ({
  handleSelectionChange,
}: {
  handleSelectionChange: (value: string) => void;
}) => {
  const radioOptions: RadioOption[] = [
    {
      value: "min_table",
      label: "Minimiser le nombre de tables",
    },
    {
      value: "max_demand",
      label: "Favoriser le nombre de demandes satisfaites",
    },
    {
      value: "max_student",
      label: "Favoriser le nombre d'étudiants satisfaits",
    },
    {
      value: "less_guest",
      label: "Satisfaire en priorité les étudiants avec le moins d'invités",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-start gap-[10px]">
      <h2 className="text-center font-bold text-[18px] text-black">
        Critère de génération du plan de table :
      </h2>
      <RadioButtonGroup
        radioOptions={radioOptions}
        defaultValue="min_table"
        onSelectionChange={handleSelectionChange}
      ></RadioButtonGroup>
    </div>
  );
};
