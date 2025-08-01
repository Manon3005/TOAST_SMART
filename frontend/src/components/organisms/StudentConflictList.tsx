import "../../styles/App.css";
import { StudentConflictCount } from "../../types/StudentConflictCount";
import StudentConflictItem from "../molecules/StudentConflictItem";

const compareConflictCount = (
  firstStudent: StudentConflictCount,
  secondStudent: StudentConflictCount
) => secondStudent.conflictCount - firstStudent.conflictCount;

const StudentConflictList = ({
  students,
  onItemClick,
}: {
  students: StudentConflictCount[];
  onItemClick: (student: StudentConflictCount) => Promise<void>;
}) => {
  return (
    <div className="item-list-container">
      {students.sort(compareConflictCount).map((student) => (
        <StudentConflictItem
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

export default StudentConflictList;
