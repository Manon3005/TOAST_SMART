import { GraduatedStudent } from "../business/GraduatedStudent";
import { ColumnsNames } from "../services/ParserService";
import * as fs from 'fs';
import * as path from 'path';

export class CsvExporter {
    static exportCsv(columnNames: ColumnsNames, graduatedStudents: GraduatedStudent[], filePath: string): void{
        const {
            firstName,
            lastName,
            buyerfirstName,
            buyerlastName,
            buyerEmail,
            diet,
            wantedTableMates,
        } = columnNames;
        const headers = [
            lastName,
            firstName,
            buyerlastName,
            buyerfirstName,
            buyerEmail,
            diet,
            wantedTableMates,
        ];
        const csvRows = [headers.join(';')];
        for (const student of graduatedStudents) {
            // Student
            const row = [
                student.getLastName(),
                student.getFirstName(),
                student.getLastName(),
                student.getFirstName(),
                student.getEmail(),
                student.getDiet(),
                student.getNeighbours().map(neighbour => `${neighbour.getLastName()} ${neighbour.getFirstName()}`).join(', '),
            ];
            csvRows.push(row.join(';'));
            for (const guest of student.getGuests()) {
                const rowGuest = [
                    guest.getLastName(),
                    guest.getFirstName(),
                    student.getLastName(),
                    student.getFirstName(),
                    student.getEmail(),
                    guest.getDiet(),
                    '',
                ];
                csvRows.push(rowGuest.join(';'));
            }
        }
        const csvContent = csvRows.join('\n');
        fs.writeFileSync(filePath, csvContent, { encoding: 'utf8' });
    }
}