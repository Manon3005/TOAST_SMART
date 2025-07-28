import { Guest } from "./Guest"

export interface Conflict {
    id: number,
    lastName: string,
    firstName: string,
    guests: Guest[]
}