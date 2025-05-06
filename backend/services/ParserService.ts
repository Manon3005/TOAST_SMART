import { GraduatedStudent, Guest } from '../business/Objects';

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

export class ReaderService {
  static async readFileCSV(csvFilePath: string): Promise<GraduatedStudent[]> {
    const absolutePath = path.resolve(csvFilePath);
    const students: GraduatedStudent[] = [];

    

    return new Promise((resolve, reject) => {
      fs.createReadStream(absolutePath)
        .pipe(parse({ delimiter: ',', columns: true, trim: true }))
        .on('data', (row: any) => {
          const student = new GraduatedStudent(
            row.lastName,
            row.firstName,
            row.email,
            parseInt(row.nbGuest),
            parseInt(row.nbNeighbour)
          );
          students.push(student);
        })
        .on('end', () => {
          resolve(students);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}