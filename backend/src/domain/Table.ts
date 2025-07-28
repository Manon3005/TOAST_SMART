import { GraduatedStudent } from "./GraduatedStudent";


export class Table {
    private id: string;
    private nbMaxStudent: number;
    private studentList: GraduatedStudent[] = [];
    private nbStudent: number;
    private nbFilledSeat: number;

    constructor(
        id: string,
        nbMaxStudent: number,
        studentList: GraduatedStudent[],
        nbStudent: number,
        nbFilledSeat: number,
    ) {
        this.id = id;
        this.nbMaxStudent = nbMaxStudent;
        this.nbStudent = nbStudent;
        this.studentList = studentList;
        this.nbFilledSeat = nbFilledSeat;
    }

    addStudent(student: GraduatedStudent) : void {
        this.studentList.push(student);
        this.nbStudent++;
        this.nbFilledSeat += 1 + student.getGuests().length;
    }

    setNbMaxStudent(nbMaxStudent: number): void {
        this.nbMaxStudent = nbMaxStudent;
    }

    setNbStudent(nbStudent : number): void {
        this.nbStudent = nbStudent;
    }
    
    getNbMaxStudent(): number {
        return this.nbMaxStudent;
    }

    getNbStudent(): number {
        return this.nbStudent;
    }

    getNbFilledSeat(): number {
        return this.nbFilledSeat;
    }

    getGraduatedStudents(): GraduatedStudent[] {
        return this.studentList;
    }

    getId(): string {
        return this.id;
    }
}