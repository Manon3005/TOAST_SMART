import '../../styles/App.css';
import { StudentConflictCount } from '../../types/StudentConflictCount';

export const StudentSelectList = ({
  label, 
  listStudent, 
  value, 
  onChange, 
  disabled 
}: {
  label: string,
  listStudent: StudentConflictCount[],
  value: string,
  onChange: (value: string) => void,
  disabled: boolean
}) => {
 const sortedStudents = [...listStudent].sort((a, b) =>
    a.lastName.localeCompare(b.lastName)
  );

  return (
    <div className="select-row">
      <label>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option key="-1" value="--selectionnez--">
          --Sélectionnez--
        </option>
        {sortedStudents.map((student) => (
          <option key={student.id} value={student.id}>
            {student.lastName} {student.firstName}
          </option>
        ))}
      </select>
    </div>
  );
}