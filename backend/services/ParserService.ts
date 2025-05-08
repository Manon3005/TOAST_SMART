import { GraduatedStudent, Guest } from "../business/Objects";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

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

          const guestIsGraduatedStudent = guestFirstName === gradFirstName && guestLastName === gradLastName;

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
          resolve(this.allGraduatedStudents);
        })
        .on("error", reject);
    });
  }

  static async deleteNonValidNeighbours(invalidNeighboursStudentId: number[]): Promise<void>{
    invalidNeighboursStudentId.forEach(id => {
      this.allGraduatedStudents.find(student => student.getId() == id)!.deleteNeighbours();      
    })
  }

  static async linkNeighboursToGraduatedStudents(): Promise<GraduatedStudent[]> {
    this.allGraduatedStudents.forEach(student => {
      const neighbourWords = student.getNeighboursString().toLowerCase().split(/\s+/);
      neighbourWords.forEach(word => {
        const matchedStudent = this.allGraduatedStudents.find(student => student.getLastName().toLowerCase() === word);
        if (matchedStudent && !student.isNeighboursAlreadyPresent(matchedStudent)) {
          student.addNeighbour(matchedStudent);
        }
      })
    })
    return this.allGraduatedStudents;
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
