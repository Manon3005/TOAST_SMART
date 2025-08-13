import { useState } from "react";
import { StudentConflictCount } from "../../types/StudentConflictCount";
import { Button } from "../atoms/Button";
import { SubSubTitle } from "../atoms/SubSubTitle";
import { StudentSelectList } from "./StudentSelectList";

export const ConflictsManuallyAddingGroup = ({
  students,
  onNeighbourManuallyAdded,
}: {
  students: StudentConflictCount[];
  onNeighbourManuallyAdded: (neighbourValueSelected: number) => void;
}) => {
  const [neighbourValueSelected, setNeighbourValueSelected] =
    useState<number>(-1);

  return (
    <div className="w-full flex flex-col items-center gap-[1rem]">
      <SubSubTitle>Ajout Manuel</SubSubTitle>
      <div className="flex flex-row justify-between items-center">
        <StudentSelectList
          listStudent={students}
          value={neighbourValueSelected}
          onChange={setNeighbourValueSelected}
          disabled={false}
        />
        <Button
          text={"✚ Ajouter voisin"}
          onClick={() => onNeighbourManuallyAdded(neighbourValueSelected)}
          disabled={neighbourValueSelected === -1}
        ></Button>
      </div>
    </div>
  );
};
