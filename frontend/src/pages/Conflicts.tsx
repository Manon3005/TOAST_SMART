import { useState, useEffect } from "react";
import StudentConflictList from "../components/organisms/StudentConflictList";
import { StudentCard } from "../components/molecules/StudentCard";
import { StudentConflictCount } from "../types/StudentConflictCount";
import { Student } from "../types/Student";
import { ResolveConflict } from "../types/ResolveConflict";
import { Button } from "../components/atoms/Button";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/molecules/AppHeader";

export default function Conflicts () {
    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const isStudentCardVisible = selectedStudent !== null;
    const [students, setStudents] = useState<StudentConflictCount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [remainingConflictNumber, setRemainingConflictNumber] = useState<number>(0);
    const [shouldFetch, setShouldFetch] = useState<boolean>(false);

    useEffect(() => {
        const fetchStudents = async () => {
            const studentList = await window.electronAPI.getAllStudent();
            setStudents(studentList);
            let total = 0;
            studentList.forEach((student) => { total = total + student.conflictCount; })
            setRemainingConflictNumber(total);
        }

        fetchStudents();
        setIsLoading(false);
    },[selectedStudent, shouldFetch])

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
        setShouldFetch(!shouldFetch);
        setRemainingConflictNumber(0);
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
        <div className='app-container'>
            <AppHeader />
            <div className='app-content'>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100vh', boxSizing: 'border-box' }}>
                    <Button
                        className="classic-button"
                        onClick={handleContinue}
                        text="Continuer et générer le fichier intermédiaire"
                        disabled={remainingConflictNumber.valueOf() !== 0}
                    />
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        gap: '20px',
                        overflow: 'hidden',
                        margin: '20px 0'
                    }}>
                        <div
                            className="item-list-container"
                            style={{
                                flexShrink: 1,
                                flexGrow: 1,
                                flexBasis: isStudentCardVisible ? '50%' : '100%',
                                minWidth: '300px',
                                overflowY: 'auto',
                                transition: 'flex-basis 0.3s ease',
                                maxHeight: '80vh'
                            }}
                        >
                            <StudentConflictList students={students} onItemClick={handleItemClick} />
                        </div>

                        {isStudentCardVisible && (
                            <div
                                className="student-container"
                                style={{
                                flexShrink: 0,
                                flexGrow: 0,
                                flexBasis: '50%',
                                overflowY: 'auto',
                                maxHeight: '80vh'
                                }}
                            >
                                <StudentCard
                                    student={selectedStudent}
                                    onClickAccept={handleAcceptConflict}
                                    onClickRefuse={handleRefuseConflict}
                                />
                            </div>
                        )}
                    </div>

                    {(remainingConflictNumber > 0) && 
                    <Button
                        className="classic-button"
                        onClick={handleRefuseAllConflicts}
                        text="⛔ Passer tous les conflits restants"
                    />}
                </div>
            </div>
        </div>
    );
}