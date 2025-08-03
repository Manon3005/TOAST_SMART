import { ChangeEvent, useState } from "react";
import { Student } from "../../types/Student";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { StudentConflictCount } from "../../types/StudentConflictCount";
import { StudentSelectList } from "./StudentSelectList";
import { Paragraph } from "../atoms/Paragraph";

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
  const [neighbourValueSelected, setNeighbourValueSelected] =
    useState<number>(-1);

  if (!student || Object.keys(student).length === 0) {
    return null; // ou un message du type "Aucune donnée"
  }

  let guestNames;
  let guestDisplay;

  if (student.conflict.length > 0) {
    guestNames = student.conflict[0].guests
      .map((guest) =>
        `${guest.guestFirstName ?? ""} ${guest.guestLastName ?? ""}`.trim()
      )
      .join(", ");
    guestDisplay =
      student.conflict[0].guests.length > 0 ? ` (${guestNames})` : "";
  }

  return (
    <div className="h-full flex flex-col justify-start items-center bg-white rounded-[1rem] p-[20px] gap-[1rem] overflow-y-auto custom-shadow-2">
      <h2 className="text-[1.8rem] font-bold text-black">
        {student.firstName} {student.lastName}
      </h2>

      <div className="w-full flex flex-col items-center gap-[0.75rem]">
        <h3 className="text-[1.2rem] font-bold text-black">Invités</h3>
        {Array.isArray(student.guests) && student.guests.length > 0 ? (
          <ul className="flex flex-col list-none w-full items-center gap-[0.25rem]">
            {student.guests.map((g, i) => (
              <li key={i} className="text-black">
                {g.guestFirstName} {g.guestLastName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[#888] italic">Aucun invité 😂🫵.</p>
        )}
      </div>

      <div className="w-full flex flex-col items-center gap-[0.75rem]">
        <h3 className="text-[1.2rem] font-bold text-black">Voisins</h3>
        {Array.isArray(student.processedNeighbours) &&
        student.processedNeighbours.length > 0 ? (
          <ul className="flex flex-col list-none w-full items-center gap-[0.25rem]">
            {student.processedNeighbours.map((n, i) => (
              <li key={i} className="w-full text-black">
                <div className="w-full flex flex-row justify-between text-left">
                  {n.neighbourFirstName + " " + n.neighbourLastName}
                  <Button
                    className="h-full w-fit bg-white hover:bg-black text-black hover:text-white text-[1rem] rounded-[8px] px-[5px] outline outline-1 outline-black hover:outline-white cursor-pointer transition-colors transition-transform duration-300 transform hover:-translate-y-[1px]"
                    text={"-"}
                    onClick={() => onNeighbourRemoved(n.neighbourId)}
                  ></Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="w-full text-[#888] text-center italic">Aucun voisin.</p>
        )}
        <p className="w-full text-black text-center">
          <strong>🗨️ Préférences indiquées : </strong>
          {student.neighboursEntry ? student.neighboursEntry : "/"}
        </p>
      </div>

      {student.conflict.length > 0 && (
        <div className="w-full flex flex-col items-center gap-[0.75rem]">
          <h3 className="text-[1.2rem] font-bold text-black">Conflits</h3>
          <p className="w-full text-black text-center">
            <strong>{student.conflict.length}</strong> conflit(s) restant(s)
          </p>
          <p className="w-full text-black text-center">
            <strong>👤 Voisin.e proposé.e : </strong>
            {student.conflict[0].firstName} {student.conflict[0].lastName}{" "}
            {guestDisplay}
          </p>
          <div className="flex flex-row justify-center gap-[50px]">
            <Button onClick={onClickAccept} text="✅ Accepter"></Button>
            <Button onClick={onClickRefuse} text="❌ Refuser"></Button>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col items-center gap-[1rem]">
        <h3 className="text-[1.2rem] font-bold text-black">Ajout Manuel</h3>
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
    </div>
  );
};
