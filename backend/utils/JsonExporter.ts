import { writeFile } from 'fs/promises';
import { GraduatedStudent } from '../business/GraduatedStudent';

export class JsonExporter {
    static async createJsonFileForAlgorithm(filepath: string, nbMaxTables: number, nbMaxByTables: number, selectedChoice: string, allGraduatedStudents : GraduatedStudent[]): Promise<void> {
        const graduatedStudents = allGraduatedStudents.map(student => ({
            idStudent: student.getId(),
            lastName: student.getLastName(),
            firstName: student.getFirstName(),
            nbOfGuests: student.getNbGuests(),
            nbOfNeighbours: student.getNbNeighbours(),
            idNeighbour: student.getNeighboursIds()
        }));
        const jsonContent = {
            option: selectedChoice,
            nb_max_tables: nbMaxTables,
            nb_max_by_tables: nbMaxByTables,
            graduated_students: graduatedStudents
        };
        const jsonString = JSON.stringify(jsonContent, null, 2);
        await writeFile(filepath, jsonString, 'utf-8');
    }

    static async getListStudents(allGraduatedStudents: GraduatedStudent[]) {
        return allGraduatedStudents.map(student => ({
            id: student.getId(),
            lastName: student.getLastName(),
            firstName: student.getFirstName(),
        })) 
    }
}