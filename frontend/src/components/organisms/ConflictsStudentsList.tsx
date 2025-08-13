import { StudentConflictCount } from "../../types/StudentConflictCount";
import ConflictsStudentItem from "../molecules/ConflictsStudentItem";

const compareConflictCount = (
  firstStudent: StudentConflictCount,
  secondStudent: StudentConflictCount
) => secondStudent.conflictCount - firstStudent.conflictCount;

const ConflictsStudentsList = ({
  students,
  onItemClick,
}: {
  students: StudentConflictCount[];
  onItemClick: (student: StudentConflictCount) => Promise<void>;
}) => {
  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] rounded-[12px] p-[20px] custom-shadow-2 gap-[10px] overflow-y-auto">
      {students.sort(compareConflictCount).map((student) => (
        <ConflictsStudentItem
          key={student.id}
          name={student.firstName}
          surname={student.lastName}
          conflictCount={student.conflictCount}
          onClick={() => onItemClick(student)}
        />
      ))}
    </div>
  );
};

export default ConflictsStudentsList;
