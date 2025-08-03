import { Student } from "../../types/Student";
import { Button } from "../atoms/Button";
import { SubSubTitle } from "../atoms/SubSubTitle";
import { ConflictsStudentPreferences } from "./ConflictsStudentPreferences";

export const ConflictsNeighboursList = ({
  student,
  onNeighbourRemoved,
}: {
  student: Student;
  onNeighbourRemoved: (id_neighbour: number) => void;
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-[0.75rem]">
      <SubSubTitle>Voisins</SubSubTitle>
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
      <ConflictsStudentPreferences student={student} />
    </div>
  );
};
