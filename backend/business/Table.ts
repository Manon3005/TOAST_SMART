import { GraduatedStudent } from "./GraduatedStudent";


export class Table {
    private id: string;
    private nbMaxStudent: number;
    private studentList: GraduatedStudent[] = [];
    private nbStudent: number;

    constructor(
        id: string,
        nbMaxStudent: number,
        studentList: GraduatedStudent[],
        nbStudent: number,
    ) {
        this.id = id;
        this.nbMaxStudent = nbMaxStudent;
        this.nbStudent = nbStudent;
        this.studentList = studentList;
    }

    addStudent(student: GraduatedStudent) : void {
        this.studentList.push(student);
        ++this.nbStudent;
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

    getId(): string {
        return this.id;
    }
}