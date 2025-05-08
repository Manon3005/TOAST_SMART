import { DiffEntry } from "util";

export class Guest {
    private id: number;
    private lastName: string;
    private firstName: string;
    private diet: string;

    constructor(id: number, lastName: string, firstName: string, diet: string) {
        this.id = id;
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
    private id: number;
    private lastName: string;
    private firstName: string;
    private email: string;
    private nbGuests: number;
    private nbNeighbours: number;
    private guests: Guest[] = [];
    private neighbours: GraduatedStudent[] = [];
    private neighboursString: string;
    private diet: string;

    constructor(
        id: number,
        lastName: string,
        firstName: string,
        email: string,
        neighboursString: string,
        nbGuests: number = 0,
        nbNeighbours: number = 0,
        diet: string = ""
    ) {
        this.id = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.neighboursString = neighboursString;
        this.nbGuests = nbGuests;
        this.nbNeighbours = nbNeighbours;
        this.diet = diet;
    }

    setDiet(diet: string): void {
        this.diet = diet;
    }
    
    addGuest(guest: Guest): void {
        this.nbGuests++;
        this.guests.push(guest);
    }

    addNeighbour(student: GraduatedStudent): void {
        this.nbNeighbours++;
        this.neighbours.push(student);
    }

    deleteNeighbours(): void {
        this.neighbours = [];
        this.nbNeighbours = 0;
    }

    isNeighboursAlreadyPresent(potentialNeighbour: GraduatedStudent): boolean {
        return this.neighbours.some(neighbour => neighbour.getId() == potentialNeighbour.getId());
    }
    
    getGuests(): Guest[] {
        return this.guests;
    }

    getNeighboursIds(): number[] {
        return this.neighbours.map(neighbour => neighbour.id);
    }

    getNeighboursString(): string {
        return this.neighboursString;
    }

    getLastName(): string {
        return this.lastName;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getNbGuests(): number {
        return this.nbGuests;
    }

    getNbNeighbours(): number {
        return this.nbNeighbours;
    }

    getId(): number {
        return this.id;
    }
}

