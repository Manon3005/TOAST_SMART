import { GraduatedStudent, Guest } from '../business/Objects';

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

export class ParserService {
  static graduatedStudent: GraduatedStudent[] = [];

  static async readFileCSV(csvFilePath: string): Promise<void> {
    const absolutePath = path.resolve(csvFilePath);
    const graduates: Map<string, GraduatedStudent> = new Map();
  
    return new Promise((resolve, reject) => {
      fs.createReadStream(absolutePath)
        .pipe(parse({ delimiter: ';', columns: true, trim: true, bom:true}))
        .on('data', (row: any) => {
          const guestName = row['Nom'].trim();
          const guestFirstName = row['Prenom'].trim();
          const graduateName = row['Nom acheteur'].trim();
          const graduateFirstName = row['Prenom acheteur'].trim();

          const graduateKey = graduateFirstName + ' ' + graduateName;

          if (guestName !== graduateName || guestFirstName !== graduateFirstName) {
            if (!graduates.has(graduateKey)) {
              const email = row['E-mail acheteur'].trim();
              graduates.set(graduateKey, new GraduatedStudent(graduateName, graduateFirstName, email));
            }
            const diet = row['Regime alimentaire #131474'].trim();
            graduates.get(graduateKey)!.addGuest(new Guest(guestName, guestFirstName, diet));
          } else {
            if (!graduates.has(graduateKey)) {
              const email = row['E-mail acheteur'].trim();
              graduates.set(graduateKey, new GraduatedStudent(graduateName, graduateFirstName, email));
            }
          }
        })
        .on('end', () => {
          ParserService.graduatedStudent = Array.from(graduates.values());
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
  static async getGraduatedStudent(): Promise<GraduatedStudent[]> {
    return this.graduatedStudent;
  }
}