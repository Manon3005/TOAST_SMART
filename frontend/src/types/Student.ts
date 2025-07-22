import { Guest } from "./Guest";
import { Conflict } from "./Conflict"
import { Neighbour } from "./Neighbour";

export interface Student {
    id: number,
    lastName: string,
    firstName: string,
    neighboursEntry: string,
    conflict: Conflict[],
    processedNeighbours: Neighbour[],
    guests: Guest[]
}