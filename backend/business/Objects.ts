import { DiffEntry } from "util";

export class Guest {
    private lastName: string;
    private firstName: string;
    private diet: string;

    constructor(lastName: string, firstName: string, diet: string) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.diet = diet;
    }

    getLastName(): string {
        return this.lastName;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getDiet(): string {
        return this.diet;
    }
}

export class GraduatedStudent {
    private lastName: string;
    private firstName: string;
    private email: string;
    private nbGuest: number;
    private nbNeighbour: number;
    private guests: Guest[] = [];
    private neighbours: GraduatedStudent[] = [];
    private neighboursString: string;
    private diet: string;

    constructor(
        lastName: string,
        firstName: string,
        email: string,
        neighboursString: string,
        nbGuest: number = 0,
        nbNeighbour: number = 0,
        diet: string = ""
    ) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.neighboursString = neighboursString;
        this.nbGuest = nbGuest;
        this.nbNeighbour = nbNeighbour;
        this.diet = diet;
    }

    setDiet(diet: string): void {
        this.diet = diet;
    }
    
    addGuest(guest: Guest): void {
        this.nbGuest++;
        this.guests.push(guest);
    }

    addNeighbour(student: GraduatedStudent): void {
        this.nbNeighbour++;
        this.neighbours.push(student);
    }

    isNeighboursAlreadyPresent(potentialNeighbour: GraduatedStudent): boolean {
        return this.neighbours.some(neighbour => neighbour.getLastName().toLowerCase() === potentialNeighbour.getLastName().toLowerCase());
    }
    
    getGuests(): Guest[] {
        return this.guests;
    }

    getNeighboursString(): string {
        return this.neighboursString;
    }

    getLastName(): string {
        return this.lastName;
    }
}

