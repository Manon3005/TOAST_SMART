import { GraduatedStudent } from "../business/GraduatedStudent";
import { Table } from "../business/Table";

export class ComputeStatistics {
    private static allGraduatedStudents : GraduatedStudent[] = [];
    private static tables: Table[] = [];
    private static tableMaxCapacity = 0;

    private static nbPossibleDemand(): number {
        let cmp = 0;
        for(const student of this.allGraduatedStudents) {
            for(const neighbour of student.getNeighbours()) {
                if(student.getGuests().length + neighbour.getGuests().length <= this.tableMaxCapacity) {
                    cmp += 1;
                }
            }
        }
        return cmp;
    }

    private static nbSatisfiedDemand(): number {
        let cmp = 0;
        for(const student of this.allGraduatedStudents) {
            for(const neighbour of student.getNeighbours()) {
                if(student.getTable().getId() === neighbour.getTable().getId()) {
                    cmp += 1;
                }
            }
        }
        return cmp;
    }

    private static meanGuestByTable(): number {
        let mean = 0;
        let sum = 0;
        for(const table of this.tables) {
            sum += table.getNbFilledSeat();
        }
        if(sum != 0) {
            mean = sum / this.tables.length;
        }
        return mean;
    }

    private static percentageStudentSatisfied() {
        let cmp = 0;
        const allGraduatedStudentsWithDemand = this.allGraduatedStudents.filter(student => student.getNeighbours.length > 0);
        for(const student of allGraduatedStudentsWithDemand) {
            const neighboursSatisfied = student
                .getNeighbours()
                .filter(neighbour => neighbour.getTable().getId() === student.getTable().getId());
            if (neighboursSatisfied.length > 0) {
                cmp++;
            }
        }
        return allGraduatedStudentsWithDemand.length === 0 ? 100 : (cmp / allGraduatedStudentsWithDemand.length) * 100;
    }

    static async getStatistics(students: GraduatedStudent[], tables: Table[], tableMaxCapacity: number): Promise<any>{
        this.allGraduatedStudents = students;
        this.tables = tables;
        this.tableMaxCapacity = tableMaxCapacity;
        return {
            percentage_student_satisfied: ComputeStatistics.percentageStudentSatisfied(),
            nb_possible_demand: ComputeStatistics.nbPossibleDemand(),
            nb_satisfied_demand: ComputeStatistics.nbSatisfiedDemand(),
            nb_used_tables: this.tables.length,
            mean_guest_by_table: ComputeStatistics.meanGuestByTable(),
        }
    }
}