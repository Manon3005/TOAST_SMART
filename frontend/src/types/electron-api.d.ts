export {};
import { AddNeighbour } from "./AddNeighbour";
import { ColumnsCSV } from "./ColumnsCSV";
import { StatsJson } from "./StatsJson";
import { TablePlan } from "./TablePlan";
import { Student } from "./Student";
import { ResolveConflict } from "./ResolveConflict";

declare global {
  interface Window {
    electronAPI: {
      pickFile: () => Promise<FileCsv>;
      parseCsvFile: (jsonColumnNames: ColumnsCSV) => Promise<any>;
      resolveConflict: (jsonSolution: ResolveConflict) => Promise<Student>;
      deleteAllConflicts: () => Promise<void>;
      addNeighbour: (jsonInfo: AddNeighbour) => Promise<void>;
      generateIntermediateCsv: () => Promise<string>;
      generateTablePlan: (jsonData: GenerateTablePlan) => Promise<TablePlan>;
      getStatistics: () => Promise<StatsJsonAddress>;
      exportTablesCsv: () => Promise<string>;
      getAllStudent: () => Promise<StudentConflictCount[]>;
      getStudentWithConflicts: (jsonSolution: {id_student: number}) => Promise<Student>;
    };
  }
}