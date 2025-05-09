import { GraduatedStudent } from "../business/GraduatedStudent";
import { Guest } from "../business/Guest";
import * as fs from "fs";
import * as path from "path";
import { parse, Parser } from "csv-parse";
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
  private static levenshteinThresholdFullName = 2;
  private static levenshteinThresholdLastName = 1;

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
      const normalizedNeighbourWords = neighbourWords
        .map(word => ParserService.normalizeString(word));
      
      // Case 1 : Matching on fullname with max 2 errors in the combination
      type firstCaseCandidateWithDistance = { candidate: GraduatedStudent; distance: number };
      let firstCaseCandidates: firstCaseCandidateWithDistance[] = [];
      let firstCaseBestDistance = Infinity;
      for (let i = 0; i < normalizedNeighbourWords.length - 1; i++) {
        const combinedNormalizedWords = ParserService.normalizeString(normalizedNeighbourWords[i] + ' ' + normalizedNeighbourWords[i+1]);
        for (const candidate of this.allGraduatedStudents) {
          const firstNameLastName = ParserService.normalizeString(candidate.getFirstName() + ' ' + candidate.getLastName());
          const lastNameFirstName = ParserService.normalizeString(candidate.getLastName() + ' ' + candidate.getFirstName());
          const distance1 = levenshtein(firstNameLastName, combinedNormalizedWords);
          const distance2 = levenshtein(lastNameFirstName, combinedNormalizedWords);
          const currentDistance = Math.min(distance1, distance2);
          if (currentDistance <= ParserService.levenshteinThresholdFullName && currentDistance <= firstCaseBestDistance) {
            firstCaseBestDistance = currentDistance;
            firstCaseCandidates.push({ candidate, distance: currentDistance });
          }
        }
      }
      for (const { candidate, distance } of firstCaseCandidates) {
        if (distance === firstCaseBestDistance && !student.isNeighboursAlreadyPresent(candidate)) {
          student.addNeighbour(candidate);
        }
      }

      // Case 2 : Matching on name with max 1 error
      type secondCaseCandidateWithDistance = { candidate: GraduatedStudent; distance: number };
      let secondCaseCandidates: secondCaseCandidateWithDistance[] = [];
      let secondCaseBestDistance = Infinity;
      for (let i = 0; i < normalizedNeighbourWords.length; i++) {
        for (const candidate of this.allGraduatedStudents) {
          const lastName = ParserService.normalizeString(candidate.getLastName());
          const distance = levenshtein(lastName, normalizedNeighbourWords[i]);
          if (distance <= ParserService.levenshteinThresholdLastName && distance <= secondCaseBestDistance) {
            secondCaseBestDistance = distance;
            secondCaseCandidates.push({ candidate, distance: distance });
          }
        }
      }
      for (const { candidate, distance } of secondCaseCandidates) {
        if (distance === secondCaseBestDistance && !student.isNeighboursAlreadyPresent(candidate)) {
          student.addNeighbour(candidate);
        }
      }
    });
  }

  static async getNeighboursPairing(): Promise<string> {
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

    return JSON.stringify({ graduated_students: graduatedStudents }, null, 2);
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
