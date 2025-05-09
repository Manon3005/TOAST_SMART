import { GraduatedStudent } from "../business/GraduatedStudent";
import { Guest } from "../business/Guest";
import { StringNormalizer } from "../utils/StringNormalizer";
import * as fs from "fs";
import * as path from "path";
import { parse, Parser } from "csv-parse";
import { writeFile } from 'fs/promises';
import { NeighboursLinker } from "../utils/NeighboursLinker";

export type ColumnsNames = {
  firstName: string;
  lastName: string;
  buyerfirstName: string;
  buyerlastName: string;
  buyerEmail: string;
  diet: string;
  wantedTableMates: string;
};

type ParsedCSVRow = Record<string, string>;

type GraduatedStudentMap = Map<string, GraduatedStudent>;
export class ParserService {
  private static guestIdCounter = 1;
  private static studentIdCounter = 1;

  private static allGraduatedStudents : GraduatedStudent[] = [];
  
  private static columns: ColumnsNames;

  static async readFileCSV(csvFilePath: string): Promise<GraduatedStudent[]> {
    const absolutePath = path.resolve(csvFilePath);
    const graduatedStudents: GraduatedStudentMap = new Map();
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(absolutePath)
        .pipe(parse({ delimiter: ";", columns: true, trim: true, bom: true }))
        .on("data", (row: ParsedCSVRow) => {
          const {
            firstName,
            lastName,
            buyerfirstName,
            buyerlastName,
            buyerEmail,
            diet,
            wantedTableMates,
          } = ParserService.columns;
          
          const guestFirstName = row[firstName]?.trim();
          const guestLastName = row[lastName]?.trim();
          const gradFirstName = row[buyerfirstName]?.trim();
          const gradLastName = row[buyerlastName]?.trim();
          const gradEmail = row[buyerEmail]?.trim();
          const tableMates = row[wantedTableMates];
          const specifiedDiet = row[diet]?.trim();

          const gradKey = `${gradFirstName} ${gradLastName}`;

          // Need to take accents and capital letters off for the comparison 
          const guestIsGraduatedStudent = 
            StringNormalizer.normalizeString(guestFirstName) === StringNormalizer.normalizeString(gradFirstName) && 
            StringNormalizer.normalizeString(guestLastName) === StringNormalizer.normalizeString(gradLastName);

          if (!graduatedStudents.has(gradKey)) {
            const id = this.getNextStudentId();
            graduatedStudents.set(
              gradKey,
              new GraduatedStudent(id, gradLastName, gradFirstName, gradEmail, tableMates)
            );
          }

          if (!guestIsGraduatedStudent) {
            const id = this.getNextGuestId();
            const guest = new Guest(id, guestLastName, guestFirstName, specifiedDiet);
            graduatedStudents.get(gradKey)!.addGuest(guest);
          }
          else {
            graduatedStudents.get(gradKey)!.setDiet(specifiedDiet);
          }
        })
        .on("end", () => {
          this.allGraduatedStudents = Array.from(graduatedStudents.values());
          this.allGraduatedStudents = NeighboursLinker.linkNeighboursToGraduatedStudents(this.allGraduatedStudents);
          resolve(this.allGraduatedStudents);
        })
        .on("error", reject);
    });
  }

  static async deleteNonValidNeighbours(graduatedStudents: { removedNeighboursList: { student_id: number[] }[] }): Promise<void> {
    graduatedStudents.removedNeighboursList.forEach(entry => {
      entry.student_id.forEach(id => {
        const student = this.allGraduatedStudents.find(student => student.getId() === id);
        if (student) {
          student.deleteNeighbour(id);
        }
      });
    });
  }

  static async getNeighboursPairing(): Promise<any> {
    const graduatedStudents = this.allGraduatedStudents.map(student => ({
      idStudent: student.getId(),
      lastName: student.getLastName(),
      firstName: student.getFirstName(),
      preferedNeighbours: student.getNeighboursString(),
      processedNeighbours: student.getNeighbours().map(neighbour => ({
        neighbourId: neighbour.getId(),
        neighbourFirstName: neighbour.getFirstName(),
        neighbourLastName: neighbour.getLastName()
      }))
    }));

    return { graduated_students: graduatedStudents };
  }

  static async createJsonFileForAlgorithm(filepath: string, nbMaxTables: number, nbMaxByTables: number): Promise<void> {
    const graduatedStudents = this.allGraduatedStudents.map(student => ({
      idStudent: student.getId(),
      lastName: student.getLastName(),
      firstName: student.getFirstName(),
      nbOfGuests: student.getNbGuests(),
      nbOfNeighbours: student.getNbNeighbours(),
      idNeighbour: student.getNeighboursIds()
    }));
    const jsonContent = {
      nb_max_tables: nbMaxTables,
      nb_max_by_tables: nbMaxByTables,
      graduated_students: graduatedStudents
    };
    const jsonString = JSON.stringify(jsonContent, null, 2);
    await writeFile(filepath, jsonString, 'utf-8');
  }

  static async getColumnNamesFromCsvFile(filePath: string): Promise<any> {
    const absolutePath = path.resolve(filePath);
    const headersCSV: string[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(absolutePath)
        .pipe(parse({ delimiter: ";", columns: true, trim: true, bom: true }))
        .on("data", (row: any) => {
          if (headersCSV.length === 0) {
            headersCSV.push(...Object.keys(row));
          }
        })
        .on("end", () => {
          resolve({ filePath, headersCSV });
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }

  static setColumnsNames(columns: ColumnsNames): void {
    this.columns = columns;
  }

  private static getNextGuestId(): number {
    return this.guestIdCounter++;
  }

  private static getNextStudentId(): number {
    return this.studentIdCounter++;
  }
}
