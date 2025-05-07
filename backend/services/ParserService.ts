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
  private static allGraduatedStudents : GraduatedStudent[] = [];
  
  private static columns: ColumnsNames = {
    firstName: "Prenom",
    lastName: "Nom",
    buyerfirstName: "Prenom acheteur",
    buyerlastName: "Nom acheteur",
    buyerEmail: "E-mail acheteur",
    diet: "Regime alimentaire #131474",
    wantedTableMates: "Avec qui voulez-vous manger? (commande) #135122",
  };

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
            graduatedStudents.set(
              gradKey,
              new GraduatedStudent(gradLastName, gradFirstName, gradEmail, tableMates)
            );
          }

          if (!guestIsGraduatedStudent) {
            const guest = new Guest(guestLastName, guestFirstName, specifiedDiet);
            graduatedStudents.get(gradKey)!.addGuest(guest);
          }
          else {
            graduatedStudents.get(gradKey)!.setDiet(specifiedDiet);
          }
        })
        .on("end", () => resolve(Array.from(graduatedStudents.values())))
        .on("error", reject);
    });
  }

  static setColumnsNames(columns: ColumnsNames): void {
    this.columns = columns;
  }
}
