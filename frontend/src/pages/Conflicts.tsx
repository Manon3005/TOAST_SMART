import { useState, useEffect } from "react";
import StudentConflictList from "../components/organisms/StudentConflictList";
import { StudentCard } from "../components/molecules/StudentCard";
import { StudentConflictCount } from "../types/StudentConflictCount";

export default function Conflicts () {
    //const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const isStudentCardVisible = selectedStudent !== null;
    const [students, setStudents] = useState<StudentConflictCount[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            const studentList = await window.electronAPI.getAllStudent();
            setStudents(studentList);
        }

        fetchStudents();
        setIsLoading(false);
    },[])

    const handleItemClick = async (student: StudentConflictCount) => {
        const result = await window.electronAPI.getStudentWithConflicts({id_student: student.id})
        setSelectedStudent(result);
    };

    if (isLoading) {
        return <div>Récupération des étudiants...</div>;
    }

    return (
    <div style={{ padding: '40px', display: 'flex', gap: '20px' }}>
        <div
            style={{
                flex: isStudentCardVisible ? 1 : 'auto',
                width: isStudentCardVisible ? '50%' : '100%',
                transition: 'width 0.3s ease',
            }}
        >
            <StudentConflictList students={students} onItemClick={handleItemClick} />
        </div>

        {isStudentCardVisible && (
            <div style={{ flex: 1 }}>
                <StudentCard //à modifier et mixer avec ConflictCenter
                    student={selectedStudent}
                />
            </div>
        )}
    </div>
  );
}