import { Guest } from "./Guest"

export interface Conflict {
    idNeighbour: string,
    lastName: string,
    firstName: string,
    guests: Guest[]
}