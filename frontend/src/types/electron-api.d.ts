export {};

declare global {
  interface Window {
    electronAPI: {
      pickFile: () => Promise<any>;
      parseCsvFile: (jsonColumnNames: any) => Promise<any>;
      getNextConflict: (jsonSolution: any) => Promise<any>;
      deleteAllConflicts: () => Promise<any>;
      addNeighbour: (jsonInfo: any) => Promise<any>;
      generateIntermediateCsv: () => Promise<any>;
      generateTablePlan: (jsonData: any) => Promise<any>;
      getStatistics: () => Promise<any>;
      exportTablesCsv: () => Promise<any>;
      getAllStudent: () => Promise<any>;
      getStudentWithConflicts: (jsonSolution: any) => Promise<any>;
    };
  }
}