import { allowedNodeEnvironmentFlags } from "process";
import { GraduatedStudent } from "../business/GraduatedStudent";

export class ConflictHandler {
    static async getNextConflict(allGraduatedStudents: GraduatedStudent[]): Promise<any> {
        let conflictNumber = 0;
        let find = false;
        let jsonContent = {};
        for(const student of allGraduatedStudents) {
            const potentialNeighbours = student.getPotentialNeighbours();
            conflictNumber += potentialNeighbours.length;
            if (potentialNeighbours.length > 0 && !find) {
                find = true;
                const firstConflict = potentialNeighbours[0];
                jsonContent = {
                    idStudent: student.getId(),
                    lastName: student.getLastName(),
                    firstName: student.getFirstName(),
                    neighboursEntry: student.getNeighboursString(),
                    conflict: {
                        idNeighbour: firstConflict.getId(),
                        lastName: firstConflict.getLastName(),
                        firstName: firstConflict.getFirstName(),
                        guests: firstConflict.getGuests().map(guest => ({
                            guestLastName: guest.getLastName(),
                            guestFirstName: guest.getFirstName(),
                        }))
                    },
                    processedNeighbours: student.getNeighbours().map(neighbour => ({
                        neighbourId: neighbour.getId(),
                        neighbourFirstName: neighbour.getFirstName(),
                        neighbourLastName: neighbour.getLastName()
                    })),
                    guests: student.getGuests().map(guest => ({
                        guestFirstName: guest.getFirstName(),
                        guestLastName: guest.getLastName(),
                    }))
                };
            }
        }
        return { remainingConflictNumber: conflictNumber, jsonContent : jsonContent };
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

    static async deleteAllConflicts(allGraduatedStudents: GraduatedStudent[]) {
        for(const student of allGraduatedStudents) {
            student.removeAllPotentialNeighbours();
        }
    }
}