import { GraduatedStudent } from "../business/GraduatedStudent";
import { ColumnsNames } from "../services/ParserService";
import * as fs from 'fs';
import * as path from 'path';

export class CsvExporter {
    static exportCsv(columnNames: ColumnsNames, graduatedStudents: GraduatedStudent[], filePath: string): void{
        const {
            ticket,
            firstName,
            lastName,
            buyerfirstName,
            buyerlastName,
            buyerEmail,
            diet,
            wantedTableMates,
        } = columnNames;
        const headers = [
            ticket,
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
            const row = [
                student.getTicket(),
                student.getLastName(),
                student.getFirstName(),
                student.getLastName(),
                student.getFirstName(),
                student.getEmail(),
                student.getDiet(),
                student.getNeighbours().map(neighbour => `${neighbour.getLastName()} ${neighbour.getFirstName()}`).join(', '),
            ];
            csvRows.push(row.map(CsvExporter.escapeCsvField).join(';'));
            for (const guest of student.getGuests()) {
                const rowGuest = [
                    guest.getTicket(),
                    guest.getLastName(),
                    guest.getFirstName(),
                    student.getLastName(),
                    student.getFirstName(),
                    student.getEmail(),
                    guest.getDiet(),
                    '',
                ];
                csvRows.push(rowGuest.map(CsvExporter.escapeCsvField).join(';'));
            }
        }
        const csvContent = csvRows.join('\n');
        fs.writeFileSync(filePath, csvContent, { encoding: 'utf8' });
    }

    private static escapeCsvField(field: string | number | null | undefined): string {
        if (field === null || field === undefined) return '';
        const str = String(field);
        if (str.includes(';') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`; // double les guillemets internes
        }
        return str;
    }
}