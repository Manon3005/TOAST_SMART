import { GraduatedStudent } from "../business/GraduatedStudent";
import { Guest } from "../business/Guest";
import { Table } from "../business/Table";
import { StringNormalizer } from "../utils/StringNormalizer";
import * as fs from "fs";
import * as path from "path";
import { parse, Parser } from "csv-parse";
import { NeighboursLinker } from "../utils/NeighboursLinker";
import { CsvExporter } from "../utils/CsvExporter";

export type InputColumnsNames = {
  ticket: string;
  firstName: string;
  lastName: string;
  buyerfirstName: string;
  buyerlastName: string;
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
    
    let homonymStudents: GraduatedStudent[] = [];
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
          let errorMessages = [];
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
          CsvExporter.exportCsv(ParserService.columns, this.allGraduatedStudents, "./backend/resources/parsing_export.csv");          
          resolve(this.allGraduatedStudents);
        })
        .on("error", reject);
    });
  }

  static async importTablesCSV(csvFilePath: string, allGraduatedStudents: GraduatedStudent[]): Promise<Table[]> {
    const absolutePath = path.resolve(csvFilePath);
    const allTables: TableMap = new Map();

    return new Promise((resolve, reject) => {
      fs.createReadStream(absolutePath)
        .pipe(parse({ delimiter: ';', columns: true, trim: true, bom: true }))
        .on('data', (row :importCSVRow) => {
          const tableId = row['Table'];
          const lastName = row['Last Name Buyer'].trim();
          const firstName = row['First Name Buyer'].trim();
          const gradKey = StringNormalizer.createKeyWithNames(firstName, lastName);

          const graduatedStudent = this.graduatedStudents.get(gradKey);

          let table = allTables.get(tableId);
          if (!table) {
            table = new Table(tableId, 11, [], 0);
            allTables.set(tableId, table);
          }
          if (graduatedStudent) {
            table.addStudent(graduatedStudent);
          }
        })
        .on('end', () => {
          this.alltables = Array.from(allTables.values());
          resolve(this.alltables);
        })
        .on('error', reject);
    });
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

  private static getNextGuestId(): number {
    return this.guestIdCounter++;
  }

  private static getNextStudentId(): number {
    return this.studentIdCounter++;
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

