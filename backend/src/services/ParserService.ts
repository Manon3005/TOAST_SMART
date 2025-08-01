import { GraduatedStudent } from "../domain/GraduatedStudent";
import { Guest } from "../domain/Guest";
import { Table } from "../domain/Table";
import { StringNormalizer } from "../utils/StringNormalizer";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as path from "path";
import { parse, Parser } from "csv-parse";
import { NeighboursLinker } from "../utils/NeighboursLinker";
import { CsvExporter } from "../utils/CsvExporter";

export type InputColumnsNames = {
  ticket: string;
  firstName: string;
  lastName: string;
  buyerFirstName: string;
  buyerLastName: string;
  buyerEmail: string;
  diet: string;
  wantedTableMates: string;
};

type importCSVRow = {
  'Table': string;
  'Last Name Buyer': string;
  'First Name Buyer': string;
  'Number of Guests (buyer included)': string;
  'Seating preferences': string;
};

type ParsedCSVRow = Record<string, string>;

type GraduatedStudentMap = Map<string, GraduatedStudent>;

type TableMap = Map<string, Table>;

type Warning = {
  message: string;
}

export class ParserService {
  private static guestIdCounter = 1;
  private static studentIdCounter = 1;

  private static allGraduatedStudents : GraduatedStudent[] = [];
  
  private static graduatedStudents: GraduatedStudentMap = new Map();

  private static alltables : Table[] = [];
  
  private static columns: InputColumnsNames;

  private static warnings : Warning[] = [];

  static async readRawFileCSV(csvFilePath: string): Promise<GraduatedStudent[]> {
    const absolutePath = path.resolve(csvFilePath);
    const homonymStudents: GraduatedStudent[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(absolutePath)
        .pipe(parse({ delimiter: ";", columns: true, trim: true, bom: true }))
        .on("data", (row: ParsedCSVRow) => {
          const {
            ticket,
            firstName,
            lastName,
            buyerFirstName,
            buyerLastName,
            buyerEmail,
            diet,
            wantedTableMates,
          } = ParserService.columns;
          
          const ticketNumber = row[ticket]?.trim();
          const guestFirstName = row[firstName]?.trim();
          const guestLastName = row[lastName]?.trim();
          const gradFirstName = row[buyerFirstName]?.trim();
          const gradLastName = row[buyerLastName]?.trim();
          const gradEmail = row[buyerEmail]?.trim();
          const tableMates = row[wantedTableMates];
          const specifiedDiet = row[diet]?.trim();

          if (
            ticketNumber === undefined ||
            guestFirstName === undefined ||
            guestLastName === undefined ||
            gradFirstName === undefined ||
            gradLastName === undefined ||
            gradEmail === undefined ||
            specifiedDiet === undefined ||
            tableMates === undefined
          ) {
            return reject(new Error(`Le fichier CSV est invalide : une ou plusieurs colonnes attendues sont mal spécifiées. \n ${ParserService.columns.ticket} ${ParserService.columns.buyerEmail} ${ParserService.columns.buyerFirstName} ${ParserService.columns.buyerLastName} ${ParserService.columns.diet} ${ParserService.columns.wantedTableMates} ${ParserService.columns.firstName} ${ParserService.columns.lastName}\n ${Object.keys(row)}`));
          }

          const gradKey = StringNormalizer.createKeyWithNames(gradFirstName, gradLastName);

          // Need to take accents and capital letters off for the comparison 
          const guestIsGraduatedStudent = 
            StringNormalizer.normalizeString(guestFirstName) === StringNormalizer.normalizeString(gradFirstName) && 
            StringNormalizer.normalizeString(guestLastName) === StringNormalizer.normalizeString(gradLastName);

          if (!this.graduatedStudents.has(gradKey)) {
            const id = this.getNextStudentId();
            this.graduatedStudents.set(
              gradKey,
              new GraduatedStudent(id, gradLastName, gradFirstName, gradEmail, tableMates)
            );
          } else {
            if (guestIsGraduatedStudent && ParserService.hasHomonym(guestFirstName, guestLastName, gradEmail)) {
              homonymStudents.push(this.graduatedStudents.get(gradKey)!);
            }
          }
          // If it is a guest OR
          // If 'has all information' => it's the case when the student's names is put also for the guest's names so it is a guest
          const currentStudent = this.graduatedStudents.get(gradKey)
          if (!guestIsGraduatedStudent || currentStudent!.hasAllInformation()) {
            const id = this.getNextGuestId();
            const guest = new Guest(id, ticketNumber, guestLastName, guestFirstName, specifiedDiet);
            this.graduatedStudents.get(gradKey)!.addGuest(guest);
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
          this.allGraduatedStudents = Array.from(this.graduatedStudents.values());
          // Check if there are missing information = failing of finding during the parsing a student for a group
          const incompleteStudents = this.allGraduatedStudents.filter(student => !student.hasAllInformation());
          const errorMessages = [];
          if(incompleteStudents.length > 0) {
            const fullNames = incompleteStudents.map(s => `${s.getLastName()} ${s.getFirstName()}`).join(", ");
            errorMessages.push(`Les étudiants suivants ne sont pas identifiés correctement (probablement une erreur dans le remplissage des noms et prénoms : ` +
                `jamais un billet avec le même nom et/ou prénom pour le détenteur du billet et l'acheteur) : ${fullNames}`);
          }
          if(homonymStudents.length > 0) {
            const fullNames = homonymStudents.map(s => `${s.getLastName()} ${s.getFirstName()}`).join(", ");
            errorMessages.push(`\nLes étudiants suivants possèdent des homonymes empêchant la bonne exécution du programme` +
            ` (même nom et prénom mais mail différent): ${fullNames}`);
          }
          if(errorMessages.length > 0) {
            return reject(new Error(errorMessages.join("\n\n")));
          }
          // If no missing information
          this.allGraduatedStudents = NeighboursLinker.linkNeighboursToGraduatedStudents(this.allGraduatedStudents);          
          resolve(this.allGraduatedStudents);
        })
        .on("error", reject);
    });
  }

  static async importTablesCSV(csvFilePath: string, allGraduatedStudents: GraduatedStudent[]): Promise<Table[]> {
    const absolutePath = csvFilePath;
    const allTables: TableMap = new Map();
    const graduatedStudents: GraduatedStudentMap = new Map();

    for (const student of allGraduatedStudents) {
      const gradKey = StringNormalizer.createKeyWithNames(student.getFirstName(), student.getLastName());
      if (!graduatedStudents.has(gradKey)) {
        graduatedStudents.set(gradKey,student);
      }
    }

    return new Promise((resolve, reject) => {
      fs.createReadStream(absolutePath)
        .pipe(parse({ delimiter: ';', columns: true, trim: true, bom: true }))
        .on('data', (row :importCSVRow) => {
          const tableId = row['Table'];
          const lastName = row['Last Name Buyer'].trim();
          const firstName = row['First Name Buyer'].trim();
          const gradKey = StringNormalizer.createKeyWithNames(firstName, lastName);

          const graduatedStudent = graduatedStudents.get(gradKey);

          if (tableId != "no table") {
            let table = allTables.get(tableId);
            if (!table) {
              table = new Table(tableId, 11, [], 0, 0);
              allTables.set(tableId, table);
            }
            if (graduatedStudent) {
              table.addStudent(graduatedStudent);
              graduatedStudent.setTable(table);
            }
          }
        })
        .on('end', () => {
          this.alltables = Array.from(allTables.values());
          resolve(this.alltables);
        })
        .on('error', reject);
    });
  }

  static async parseRapportJson(path: string): Promise<any> {
    try {
      const content = await fsPromises.readFile(path, "utf-8");
      const json = JSON.parse(content);
      if (!("nb_table_missing" in json) ||
          !("nb_student_without_table" in json) ||
          !("extra_table" in json)
      ) {
        throw new Error("Le fichier JSON ne contient pas tous les champs nécessaires.");
      }
      return json;
    } catch (error: any) {
      throw new Error(`Erreur lors de la lecture du fichier JSON : ${error.message}`);
    }
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

  static setInputColumnsNames(columns: InputColumnsNames): void {
    this.columns = columns;
  }

  static reinitialize(): void {
    this.allGraduatedStudents = [];
    this.alltables = [];
    this.graduatedStudents = new Map();
    this.warnings = [];
  }

  static reinitializeTables(): void {
    this.alltables = [];
  }

  private static getNextGuestId(): number {
    return this.guestIdCounter++;
  }

  private static getNextStudentId(): number {
    return this.studentIdCounter++;
  }

  private static getTables(): Table[] {
    return this.alltables;
  }

  private static hasHomonym(firstName: string, lastName: string, mail: string): boolean {
    for(const student of this.graduatedStudents.values()) {
      if(student.isHomonym(firstName, lastName, mail)) {
        return true;
      }
    }
    return false;
  }
}

