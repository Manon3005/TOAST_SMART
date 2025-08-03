import { ChangeEvent, useState } from "react";
import { Student } from "../../types/Student";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { StudentConflictCount } from "../../types/StudentConflictCount";
import { StudentSelectList } from "../molecules/StudentSelectList";
import { Paragraph } from "../atoms/Paragraph";
import { SubSubTitle } from "../atoms/SubSubTitle";
import { ConflictsGuestsList } from "../molecules/ConflictsGuestsList";
import { ConflictsNeighboursList } from "../molecules/ConflictsNeighboursList";
import { ConflictsConflictDisplay } from "../molecules/ConflictsConflictDisplay";
import { ConflictsManuallyAddingGroup } from "../molecules/ConflictsManuallyAddingGroup";

export const ConflictsStudentCard = ({
  student,
  students,
  onClickAccept,
  onClickRefuse,
  onNeighbourManuallyAdded,
  onNeighbourRemoved,
}: {
  student: Student;
  students: StudentConflictCount[];
  onClickAccept: () => void;
  onClickRefuse: () => void;
  onNeighbourManuallyAdded: (id_neighbour: number) => void;
  onNeighbourRemoved: (id_neighbour: number) => void;
}) => {
  if (!student || Object.keys(student).length === 0) {
    return null; // ou un message du type "Aucune donnée"
  }

  return (
    <div className="h-full flex flex-col justify-start items-center bg-white rounded-[1rem] p-[20px] gap-[1rem] overflow-y-auto custom-shadow-2">
      <h2 className="w-full text-center text-[1.8rem] font-bold text-black">
        {student.firstName} {student.lastName}
      </h2>
      <ConflictsGuestsList student={student} />
      <ConflictsNeighboursList
        student={student}
        onNeighbourRemoved={onNeighbourRemoved}
      />
      {student.conflict.length > 0 && (
        <ConflictsConflictDisplay
          student={student}
          onClickAccept={onClickAccept}
          onClickRefuse={onClickRefuse}
        />
      )}
      <ConflictsManuallyAddingGroup
        students={students}
        onNeighbourManuallyAdded={onNeighbourManuallyAdded}
      />
    </div>
  );
};
