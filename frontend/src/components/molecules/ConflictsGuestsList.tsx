import { Student } from "../../types/Student";
import { SubSubTitle } from "../atoms/SubSubTitle";

export const ConflictsGuestsList = ({ student }: { student: Student }) => {
  return (
    <div className="w-full flex flex-col items-center gap-[0.75rem]">
      <SubSubTitle>Invités</SubSubTitle>
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
  );
};
