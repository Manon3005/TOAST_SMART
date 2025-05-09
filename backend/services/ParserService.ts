import { GraduatedStudent } from "../business/GraduatedStudent";
import { Guest } from "../business/Guest";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { writeFile } from 'fs/promises';
import { get as levenshtein } from 'fast-levenshtein';

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
            ParserService.normalizeString(guestFirstName) === ParserService.normalizeString(gradFirstName) && 
            ParserService.normalizeString(guestLastName) === ParserService.normalizeString(gradLastName);

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
          ParserService.linkNeighboursToGraduatedStudents();
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

  private static linkNeighboursToGraduatedStudents(): void {
    this.allGraduatedStudents.forEach(student => {
      const neighbourWords = student.getNeighboursString().toLowerCase().split(/[\s,;:.!?]+/);
      neighbourWords.forEach(word => {
        const normalizedWord = ParserService.normalizeString(word);
        const matchedStudent = ParserService.findBestMatchingGraduatedStudent(normalizedWord);
        if (matchedStudent && !student.isNeighboursAlreadyPresent(matchedStudent)) {
          student.addNeighbour(matchedStudent);
        }
      })
    })
  }

  private static findBestMatchingGraduatedStudent(normalizedWord: string): GraduatedStudent | undefined {
    //Normalization and fuzzy matching for neighbour names
    const threshold = 1;
    const candidates = this.allGraduatedStudents
      .map(student => {
        const normalizedLastName = ParserService.normalizeString(student.getLastName());
        const distance = levenshtein(normalizedLastName,normalizedWord);
        return { student, distance };
      })
      .filter(({ distance }) => distance <= threshold);
    // Prioritize exact matches (distance 0) even if multiple exist
    const exactMatch = candidates.find(candidate => candidate.distance === 0);
    if(exactMatch) {
      return exactMatch.student;
    }
    // Ignore matches when multiple similar candidates are found (distance ≤ 1)
    if (candidates.length === 1) {
      return candidates[0].student;
    }
    return undefined;
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

  static setColumnsNames(columns: ColumnsNames): void {
    this.columns = columns;
  }

  private static getNextGuestId(): number {
    return this.guestIdCounter++;
  }

  private static getNextStudentId(): number {
    return this.studentIdCounter++;
  }

  private static removeAccents(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  private static normalizeString(str: string): string {
    return ParserService
      .removeAccents(str)
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase(); 
  }
}
