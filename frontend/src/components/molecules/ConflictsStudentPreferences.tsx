import { Student } from "../../types/Student";

export const ConflictsStudentPreferences = ({
  student,
}: {
  student: Student;
}) => {
  return (
    <p className="w-full text-black text-center">
      <strong>🗨️ Préférences indiquées : </strong>
      {student.neighboursEntry ? student.neighboursEntry : "/"}
    </p>
  );
};
