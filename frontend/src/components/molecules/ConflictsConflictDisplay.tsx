import { Student } from "../../types/Student";
import { Button } from "../atoms/Button";
import { SubSubTitle } from "../atoms/SubSubTitle";

export const ConflictsConflictDisplay = ({
  student,
  onClickAccept,
  onClickRefuse,
}: {
  student: Student;
  onClickAccept: () => void;
  onClickRefuse: () => void;
}) => {
  const guestNames = student.conflict[0].guests
    .map((guest) =>
      `${guest.guestFirstName ?? ""} ${guest.guestLastName ?? ""}`.trim()
    )
    .join(", ");
  const guestDisplay =
    student.conflict[0].guests.length > 0 ? ` (${guestNames})` : "";

  return (
    <div className="w-full flex flex-col items-center gap-[0.75rem]">
      <SubSubTitle>Conflits</SubSubTitle>
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
  );
};
