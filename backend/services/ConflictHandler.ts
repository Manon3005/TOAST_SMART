import { GraduatedStudent } from "../business/GraduatedStudent";

export class ConflictHandler {
    static async getNextConflict(allGraduatedStudents: GraduatedStudent[]): Promise<any> {
        for(const student of allGraduatedStudents) {
            const potentialNeighbours = student.getPotentialNeighbours();
            if (potentialNeighbours) {
                const firstConflict = potentialNeighbours[0];
                return {
                    idStudent: student.getId(),
                    lastName: student.getLastName(),
                    firstName: student.getFirstName(),
                    preferedNeighbours: student.getNeighboursString(),
                    conflict: {
                        idNeighbour: firstConflict.getId(),
                        lastName: firstConflict.getLastName(),
                        firstName: firstConflict.getFirstName(),
                    },
                    processedNeighbours: student.getNeighbours().map(neighbour => ({
                        neighbourId: neighbour.getId(),
                        neighbourFirstName: neighbour.getFirstName(),
                        neighbourLastName: neighbour.getLastName()
                    })),
                }
            }
        }
        return {};
    }

    static async resolveConflict(id_student: number, id_neighbour: number, result: string, allGraduatedStudents: GraduatedStudent[]):  Promise<void> {
        for(const student of allGraduatedStudents) {
            if (student.getId() === id_student) {
                for (const neighbour of student.getPotentialNeighbours()) {
                    if (neighbour.getId() === id_neighbour) {
                        if (result === "valid") {
                            student.addNeighbour(neighbour);
                        }
                        student.removePotentialNeighbour(id_neighbour);
                    }
                }
            }
        }
    }
}