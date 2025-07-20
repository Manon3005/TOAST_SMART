import { Guest } from "./Guest";
import { Conflict } from "./Conflict"
import { Neighbour } from "./Neighbour";

export interface Student {
    idStudent: string,
    lastName: string,
    firstName: string,
    neighboursEntry: string,
    conflict: Conflict[],
    processedNeighbours: Neighbour[],
    guests: Guest[]
}