import { useState, useEffect } from "react";
import ConflictsStudentsList from "../components/organisms/ConflictsStudentsList";
import { ConflictsStudentCard } from "../components/organisms/ConflictsStudentCard";
import { StudentConflictCount } from "../types/StudentConflictCount";
import { Student } from "../types/Student";
import { ResolveConflict } from "../types/ResolveConflict";
import { Button } from "../components/atoms/Button";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/organisms/AppHeader";
import { AddOrRemoveNeighbour } from "../types/AddOrRemoveNeighbour";
import { ConflictsHeaderButton } from "../components/molecules/ConflictsHeaderButton";

export default function Conflicts() {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const isStudentCardVisible = selectedStudent !== null;
  const [students, setStudents] = useState<StudentConflictCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingConflictNumber, setRemainingConflictNumber] =
    useState<number>(0);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const studentList = await window.electronAPI.getAllStudent();
        setStudents(studentList);
        let total = 0;
        studentList.forEach((student) => {
          total = total + student.conflictCount;
          setRemainingConflictNumber(total);
        });
      } catch (error) {
        console.error("Erreur lors du chargements des étudiants");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [selectedStudent, shouldFetch]);

  const handleItemClick = async (student: StudentConflictCount) => {
    const result = await window.electronAPI.getStudentWithConflicts({
      id_student: student.id,
    });
    setSelectedStudent(result);
  };

  const handleAcceptConflict = async () => {
    const jsonContent: ResolveConflict = {
      id_neighbour: selectedStudent!.conflict[0].id,
      id_student: selectedStudent!.id,
      result: "accepted",
    };
    const result = await window.electronAPI.resolveConflict(jsonContent);
    setSelectedStudent(result);
  };

  const handleRefuseConflict = async () => {
    const jsonContent: ResolveConflict = {
      id_neighbour: selectedStudent!.conflict[0].id,
      id_student: selectedStudent!.id,
      result: "refused",
    };
    const result = await window.electronAPI.resolveConflict(jsonContent);
    setSelectedStudent(result);
  };

  const handleNeighbourManuallyAdded = async (id_neighbour: number) => {
    const jsonContent: AddOrRemoveNeighbour = {
      id_student: selectedStudent!.id,
      id_neighbour: id_neighbour,
    };
    const result = await window.electronAPI.addNeighbour(jsonContent);
    setSelectedStudent(result);
  };

  const handleNeighbourRemoved = async (id_neighbour: number) => {
    const jsonContent: AddOrRemoveNeighbour = {
      id_student: selectedStudent!.id,
      id_neighbour: id_neighbour,
    };
    const result = await window.electronAPI.removeNeighbour(jsonContent);
    setSelectedStudent(result);
  };

  const handleRefuseAllConflicts = async () => {
    await window.electronAPI.deleteAllConflicts();
    setShouldFetch(true);
    setRemainingConflictNumber(0);
  };

  const handleContinue = async () => {
    const filePath = await window.electronAPI.generateIntermediateCsv();
    console.log(filePath);
    navigate("/solution");
  };

  if (isLoading) {
    return <div>Récupération des étudiants...</div>;
  }

  return (
    <div className="h-full flex flex-col items-center bg-[#E9E9E9] font-['Segoe_UI'] text-white px-[20px] gap-[20px]">
      <AppHeader />
      <ConflictsHeaderButton
        remainingConflictNumber={remainingConflictNumber}
        handleContinue={handleContinue}
        handleRefuseAllConflicts={handleRefuseAllConflicts}
      />
      <div className="w-full flex flex-row items-center justify-around px-[20px] pb-[10px] overflow-hidden">
        <div
          style={{ height: "calc(100vh - 270px)" }}
          className={`h-full ${
            isStudentCardVisible ? "w-[45%]" : "w-full"
          } p-[20px] bg-[#f9f9f9] rounded-[12px] custom-shadow`}
        >
          <ConflictsStudentsList
            students={students}
            onItemClick={handleItemClick}
          />
        </div>
        {isStudentCardVisible && (
          <div
            style={{ height: "calc(100vh - 270px)" }}
            className="h-full w-[45%] flex flex-col justify-start bg-white rounded-[1rem] p-[20px] gap-[1rem] overflow-y-auto custom-shadow"
          >
            <ConflictsStudentCard
              student={selectedStudent}
              students={students}
              onClickAccept={handleAcceptConflict}
              onClickRefuse={handleRefuseConflict}
              onNeighbourManuallyAdded={handleNeighbourManuallyAdded}
              onNeighbourRemoved={handleNeighbourRemoved}
            />
          </div>
        )}
      </div>
    </div>
  );
}
