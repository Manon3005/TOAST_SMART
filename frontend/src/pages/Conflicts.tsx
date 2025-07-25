import { useState, useEffect } from "react";
import StudentConflictList from "../components/organisms/StudentConflictList";
import { StudentCard } from "../components/molecules/StudentCard";
import { StudentConflictCount } from "../types/StudentConflictCount";
import { Student } from "../types/Student";
import { ResolveConflict } from "../types/ResolveConflict";
import { Button } from "../components/atoms/Button";
import { useNavigate } from "react-router-dom";

export default function Conflicts () {
    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const isStudentCardVisible = selectedStudent !== null;
    const [students, setStudents] = useState<StudentConflictCount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [remainingConflictNumber, setRemainingConflictNumber] = useState<number>(0);

    useEffect(() => {
        const fetchStudents = async () => {
            const studentList = await window.electronAPI.getAllStudent();
            setStudents(studentList);
            setRemainingConflictNumber(0);
            studentList.forEach((student) => { setRemainingConflictNumber(remainingConflictNumber + student.conflictCount); })
        }

        fetchStudents();
        setIsLoading(false);
    },[selectedStudent])

    const handleItemClick = async (student: StudentConflictCount) => {
        const result = await window.electronAPI.getStudentWithConflicts({id_student: student.id})
        setSelectedStudent(result);
    };

    const handleAcceptConflict = async () => {
        const jsonContent : ResolveConflict = {
            id_neighbour: selectedStudent!.conflict[0].id,
            id_student: selectedStudent!.id,
            result: 'accepted'
        }
        const result = await window.electronAPI.resolveConflict(jsonContent)
        setSelectedStudent(result);
    }

    const handleRefuseConflict = async () => {
        const jsonContent : ResolveConflict = {
            id_neighbour: selectedStudent!.conflict[0].id,
            id_student: selectedStudent!.id,
            result: 'refused'
        }
        const result = await window.electronAPI.resolveConflict(jsonContent)
        setSelectedStudent(result);
    }

    const handleRefuseAllConflicts = async () => {
        await window.electronAPI.deleteAllConflicts();
        setSelectedStudent(null);
    }

    const handleContinue = async () => {
        const filePath = await window.electronAPI.generateIntermediateCsv();
        console.log(filePath);
        navigate('/solution')
    }

    if (isLoading) {
        return <div>Récupération des étudiants...</div>;
    }

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column'}}>
            <Button className='classic-button' onClick={handleContinue} text='Continuer et générer le fichier intermédiaire' disabled={remainingConflictNumber.valueOf() != 0}></Button>
            <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
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
                            onClickAccept={handleAcceptConflict}
                            onClickRefuse={handleRefuseConflict}
                        />
                    </div>
                )}
            </div>
            <Button className='classic-button' onClick={handleRefuseAllConflicts} text='⛔ Passer tous les conflits restants'></Button>
        </div>
    );
}