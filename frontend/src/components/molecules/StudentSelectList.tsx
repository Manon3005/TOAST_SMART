import { StudentConflictCount } from "../../types/StudentConflictCount";

export const StudentSelectList = ({
  listStudent,
  value,
  onChange,
  disabled,
}: {
  listStudent: StudentConflictCount[];
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}) => {
  const sortedStudents = [...listStudent].sort((a, b) =>
    a.lastName.localeCompare(b.lastName)
  );

  return (
    <div className="select-row">
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      >
        <option key={-1} value={-1}>
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
};
