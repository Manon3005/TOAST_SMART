import '../../styles/App.css';
import { StudentConflictCount } from '../../types/StudentConflictCount';
import StudentConflictItem from '../molecules/StudentConflictItem';

const StudentConflictList = (
  { students, 
    onItemClick 
  } : {
    students: StudentConflictCount[],
    onItemClick: (student: StudentConflictCount) => Promise<void>
  }) => {
  return (
    <div className="student-list-container">
      {students.map((student, index) => (
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
