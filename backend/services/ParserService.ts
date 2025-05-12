import { GraduatedStudent } from "../business/GraduatedStudent";
import { Guest } from "../business/Guest";
import { StringNormalizer } from "../utils/StringNormalizer";
import * as fs from "fs";
import * as path from "path";
import { parse, Parser } from "csv-parse";
import { writeFile } from 'fs/promises';
import { NeighboursLinker } from "../utils/NeighboursLinker";
import { CsvExporter } from "../utils/CsvExporter";

export type ColumnsNames = {
  ticket: string;
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

type Warning = {
  message: string;
}
export class ParserService {
  private static guestIdCounter = 1;
  private static studentIdCounter = 1;

  private static allGraduatedStudents : GraduatedStudent[] = [];
  
  private static columns: ColumnsNames;

  private static warnings : Warning[] = [];

  static async readFileCSV(csvFilePath: string): Promise<GraduatedStudent[]> {
    const absolutePath = path.resolve(csvFilePath);
    const graduatedStudents: GraduatedStudentMap = new Map();
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(absolutePath)
        .pipe(parse({ delimiter: ";", columns: true, trim: true, bom: true }))
        .on("data", (row: ParsedCSVRow) => {
          const {
            ticket,
            firstName,
            lastName,
            buyerfirstName,
            buyerlastName,
            buyerEmail,
            diet,
            wantedTableMates,
          } = ParserService.columns;
          
          const ticketNumber = row[ticket]?.trim();
          const guestFirstName = row[firstName]?.trim();
          const guestLastName = row[lastName]?.trim();
          const gradFirstName = row[buyerfirstName]?.trim();
          const gradLastName = row[buyerlastName]?.trim();
          const gradEmail = row[buyerEmail]?.trim();
          const tableMates = row[wantedTableMates];
          const specifiedDiet = row[diet]?.trim();

          const gradKey = `${StringNormalizer.normalizeString(gradFirstName)} ${StringNormalizer.normalizeString(gradLastName)}`;

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
          // If it is a guest OR
          // If 'has all information' => it's the case when the student's names is put also for the guest's names so it is a guest
          const currentStudent = graduatedStudents.get(gradKey)
          if (!guestIsGraduatedStudent || currentStudent!.hasAllInformation()) {
            const id = this.getNextGuestId();
            const guest = new Guest(id, ticketNumber, guestLastName, guestFirstName, specifiedDiet);
            graduatedStudents.get(gradKey)!.addGuest(guest);
            if (currentStudent?.hasDifferentEmail(gradEmail) && !currentStudent?.catchedDoubleEmail()){
              currentStudent.catchDoubleEmail();
              this.warnings.push({message: currentStudent.getLastName() + " " +
                currentStudent.getFirstName() + " a utilisé deux adresses mail pour s'inscrire."})
            }
          }
          else {
            currentStudent!.setDiet(specifiedDiet);
            currentStudent!.setTicket(ticketNumber);
          }
        })
        .on("end", () => {
          this.allGraduatedStudents = Array.from(graduatedStudents.values());
          // Check if there are missing information = failing of finding during the parsing a student for a group
          const incompleteStudents = this.allGraduatedStudents.filter(student => !student.hasAllInformation());
          if(incompleteStudents.length > 0) {
            const fullNames = incompleteStudents.map(s => `${s.getLastName()} ${s.getFirstName()}`).join(", ");
            return reject(
              new Error(`Les étudiants suivants ne sont pas identifiés correctement (probablement une erreur dans le remplissage des noms et prénoms : ` +
                `jamais un billet avec le même nom et/ou prénom pour le détenteur du billet et l'acheteur) : ${fullNames}`)
            );
          }
          // If no missing information
          this.allGraduatedStudents = NeighboursLinker.linkNeighboursToGraduatedStudents(this.allGraduatedStudents);
          CsvExporter.exportCsv(ParserService.columns, this.allGraduatedStudents, "./backend/resources/parsing_export.csv");          
          resolve(this.allGraduatedStudents);
        })
        .on("error", reject);
    });
  }

  static async deleteNonValidNeighbours(invalidNeighbours: { [studentId: string]: number[] }): Promise<void> {
    Object.entries(invalidNeighbours).forEach(([studentId, neighboursToRemove]) => {
      const student = this.allGraduatedStudents.find(student => student.getId() === parseInt(studentId,10));
      if (student && Array.isArray(neighboursToRemove)) {
        neighboursToRemove.forEach(neighbourId => {
          student.deleteNeighbour(neighbourId);
        });
      }
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
    const jsonContent = {
      warnings: this.warnings,
      graduated_students: graduatedStudents
    };

    return jsonContent;
  }

  static async fetchGraduatedStudentsList(): Promise<any> {
    const graduatedStudents = this.allGraduatedStudents.map(student => ({
      idStudent: student.getId(),
      lastName: student.getLastName(),
      firstName: student.getFirstName(),
      guests: student.getGuests().map(guest => ({
        guestId: guest.getId(),
        guestFirstName: guest.getFirstName(),
        guestLastName: guest.getLastName()
      })),
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
