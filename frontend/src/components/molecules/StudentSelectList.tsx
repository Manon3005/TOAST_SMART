import { StudentConflictCount } from "../../types/StudentConflictCount";
import { Select } from "../atoms/Select";
import { Option } from "../atoms/Option";

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
    <div className="w-full flex flex-col items-center gap-[5px]">
      <Select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      >
        <Option key={-1} value={-1}>
          --Sélectionnez--
        </Option>
        {sortedStudents.map((student) => (
          <Option key={student.id} value={student.id}>
            {student.lastName} {student.firstName}
          </Option>
        ))}
      </Select>
    </div>
  );
};
